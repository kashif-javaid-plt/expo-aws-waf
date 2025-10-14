import ExpoModulesCore
import WafMobileSdk

public class AWSWafMobileModule: Module {
  private var wafTokenProvider: WAFTokenProvider?
  private var isWAFInitialized = false
  private var setTokenCookieEnabled = true
  
  public func definition() -> ModuleDefinition {
    Name("AWSWafMobile")

    Constant("PI") {
      Double.pi
    }

    Events("onChange", "onTokenGenerated", "onError")

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }
    
    // AWS WAF specific functions
    AsyncFunction("initialize") { (config: [String: Any]) -> Void in
      guard let applicationIntegrationUrlString = config["applicationIntegrationUrl"] as? String,
            let domainName = config["domainName"] as? String,
            let url = URL(string: applicationIntegrationUrlString) else {
        throw Exception(name: "InvalidConfiguration", description: "Missing or invalid required configuration parameters")
      }
      
      let backgroundRefreshEnabled = config["backgroundRefreshEnabled"] as? Bool ?? true
      self.setTokenCookieEnabled = config["setTokenCookie"] as? Bool ?? true
      
      do {
        let configuration = WAFConfiguration(
          applicationIntegrationUrl: url,
          domainName: domainName,
          backgroundRefreshEnabled: backgroundRefreshEnabled,
          setTokenCookie: self.setTokenCookieEnabled
        )
        
        self.wafTokenProvider = WAFTokenProvider(configuration)
        
        // Set up the token ready callback
        self.wafTokenProvider?.onTokenReady { [weak self] token, error in
          if let token = token {
            self?.sendEvent("onTokenGenerated", ["token": token])
          }
          if let error = error {
            self?.sendEvent("onError", [
              "error": "Token generation error: \(error.localizedDescription)"
            ])
          }
        }
        
        self.isWAFInitialized = true
      } catch {
        self.sendEvent("onError", [
          "error": "Failed to initialize WAF SDK: \(error.localizedDescription)"
        ])
        throw Exception(name: "InitializationError", description: error.localizedDescription)
      }
    }
    
    AsyncFunction("generateToken") { () -> String in
      guard let wafTokenProvider = self.wafTokenProvider, self.isWAFInitialized else {
        throw Exception(name: "NotInitialized", description: "WAF SDK not initialized")
      }
      
      let token = wafTokenProvider.getToken()
      if let token = token {
        return token
      } else {
        throw Exception(name: "TokenGenerationError", description: "Failed to generate token")
      }
    }
    
    Function("isInitialized") {
      return self.isWAFInitialized
    }
    
    Function("getVersion") {
      // Return a version string - you may need to adjust this based on actual SDK API
      return "2.1.2"
    }
    
    // Cookie management methods
    AsyncFunction("setTokenCookie") { (enabled: Bool) -> Void in
      self.setTokenCookieEnabled = enabled
    }
    
    AsyncFunction("getTokenCookie") { () -> String? in
      guard self.setTokenCookieEnabled,
            let wafTokenProvider = self.wafTokenProvider,
            self.isWAFInitialized else {
        return nil
      }
      
      let token = wafTokenProvider.getToken()
      if let token = token {
        return "aws-waf-token=\(token)"
      }
      return nil
    }

    View(AWSWafMobileView.self) {
      Prop("url") { (view: AWSWafMobileView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}
