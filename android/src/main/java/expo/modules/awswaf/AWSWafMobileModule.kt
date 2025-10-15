package expo.modules.awswaf

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.net.URL
import android.content.Context
import android.app.Application
import java.net.CookieManager
import java.net.CookieHandler
import java.net.CookiePolicy

// Import AWS WAF SDK classes
import com.amazonaws.waf.mobilesdk.token.WAFConfiguration
import com.amazonaws.waf.mobilesdk.token.WAFTokenProvider

class AWSWafMobileModule : Module() {
  private var wafTokenProvider: WAFTokenProvider? = null
  private var isWAFInitialized = false
  private var setTokenCookieEnabled = true

  override fun definition() = ModuleDefinition {
    Name("AWSWafMobile")

    Constant("PI") {
      Math.PI
    }

    Events("onChange", "onTokenGenerated", "onError")

    Function("hello") {
      "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { value: String ->
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }
    
    // AWS WAF specific functions
    AsyncFunction("initialize") { config: Map<String, Any>, promise: Promise ->
      try {
        val applicationIntegrationUrl = config["applicationIntegrationUrl"] as? String
        val domainName = config["domainName"] as? String
        val backgroundRefreshEnabled = config["backgroundRefreshEnabled"] as? Boolean ?: true
        setTokenCookieEnabled = config["setTokenCookie"] as? Boolean ?: true
        
        if (applicationIntegrationUrl == null || domainName == null) {
          promise.reject("InvalidConfiguration", "Missing required configuration parameters", null)
          return@AsyncFunction
        }
        
        // Create WAF configuration
        val url = URL(applicationIntegrationUrl)
        val wafConfiguration = WAFConfiguration.builder()
          .applicationIntegrationURL(url)
          .domainName(domainName)
          .backgroundRefreshEnabled(backgroundRefreshEnabled)
          .setTokenCookie(setTokenCookieEnabled)
          .build()
        
        // Initialize CookieManager if setTokenCookie is enabled
        if (setTokenCookieEnabled) {
          var cookieManager = CookieHandler.getDefault() as? CookieManager
          if (cookieManager == null) {
            cookieManager = CookieManager()
            cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER)
            CookieHandler.setDefault(cookieManager)
          }
        }
        
        // Get application context
        val application = appContext.reactContext?.applicationContext as? Application
        if (application == null) {
          promise.reject("ApplicationContextError", "Unable to get application context", null)
          return@AsyncFunction
        }
        
        // Initialize WAF token provider
        wafTokenProvider = WAFTokenProvider(application, wafConfiguration)
        
        // Set up token ready callback
        wafTokenProvider?.onTokenReady { wafToken, sdkError ->
          if (wafToken != null) {
            sendEvent("onTokenGenerated", mapOf("token" to wafToken.value))
          }
          if (sdkError != null) {
            sendEvent("onError", mapOf(
              "error" to "Token generation error: ${sdkError}",
              "code" to sdkError.hashCode()
            ))
          }
        }
        
        isWAFInitialized = true
        promise.resolve(null)
        
      } catch (e: Exception) {
        sendEvent("onError", mapOf(
          "error" to "Failed to initialize WAF SDK: ${e.message}"
        ))
        promise.reject("InitializationError", e.message, e)
      }
    }
    
    AsyncFunction("generateToken") { promise: Promise ->
      if (!isWAFInitialized || wafTokenProvider == null) {
        promise.reject("NotInitialized", "WAF SDK not initialized", null)
        return@AsyncFunction
      }
      
      try {
        val token = wafTokenProvider?.token
        if (token != null) {
          promise.resolve(token.value)
        } else {
          promise.reject("TokenGenerationError", "Failed to generate token", null)
        }
      } catch (e: Exception) {
        sendEvent("onError", mapOf(
          "error" to "Token generation error: ${e.message}"
        ))
        promise.reject("TokenGenerationError", e.message, e)
      }
    }
    
    Function("isInitialized") {
      isWAFInitialized
    }
    
    // Cookie management methods
    AsyncFunction("setTokenCookie") { enabled: Boolean, promise: Promise ->
      try {
        setTokenCookieEnabled = enabled
        
        if (enabled) {
          // Ensure CookieManager is initialized
          var cookieManager = CookieHandler.getDefault() as? CookieManager
          if (cookieManager == null) {
            cookieManager = CookieManager()
            cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER)
            CookieHandler.setDefault(cookieManager)
          }
        }
        
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("CookieManagementError", e.message, e)
      }
    }
    
    AsyncFunction("getTokenCookie") { promise: Promise ->
      try {
        if (!setTokenCookieEnabled || wafTokenProvider == null) {
          promise.resolve(null)
          return@AsyncFunction
        }
        
        val token = wafTokenProvider?.token
        if (token != null) {
          val cookieValue = "aws-waf-token=${token.value}"
          promise.resolve(cookieValue)
        } else {
          promise.resolve(null)
        }
      } catch (e: Exception) {
        promise.reject("CookieRetrievalError", e.message, e)
      }
    }

    View(AWSWafMobileView::class) {
      Prop("url") { view: AWSWafMobileView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      Events("onLoad")
    }
  }
}
