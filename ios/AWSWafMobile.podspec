require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'AWSWafMobile'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/kashif-javaid-plt/expo-aws-waf' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Include the WafMobileSdk xcframework
  s.vendored_frameworks = 'WafMobileSdk.xcframework'
  s.preserve_paths = 'WafMobileSdk.xcframework/**/*'

  # XCFramework configuration - don't import the XCFramework headers in umbrella header
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  s.source_files = "AWSWafMobileModule.swift", "AWSWafMobileView.swift"
end
