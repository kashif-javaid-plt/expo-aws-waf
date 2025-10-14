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

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386',
    'EXCLUDED_ARCHS[sdk=iphoneos*]' => 'armv7',
    'EXCLUDED_ARCHS[sdk=appletvsimulator*]' => 'i386',
    'EXCLUDED_ARCHS[sdk=appletvos*]' => 'armv7'
  }

  s.user_target_xcconfig = {
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386',
    'EXCLUDED_ARCHS[sdk=iphoneos*]' => 'armv7',
    'EXCLUDED_ARCHS[sdk=appletvsimulator*]' => 'i386', 
    'EXCLUDED_ARCHS[sdk=appletvos*]' => 'armv7'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
