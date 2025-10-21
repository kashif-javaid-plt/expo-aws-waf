# Installation Guide

## Installing AWS WAF Mobile SDK via JitPack

### Simple Installation (No Authentication Required)

Add this to your app's `build.gradle` file:

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.kashif-javaid-plt:expo-aws-waf:1.0.0'
}
```

### That's it! 🎉

The package includes:
- AWS WAF Mobile SDK for Android (.aar)
- Required dependencies (Gson, BouncyCastle)
- ProGuard rules for proper obfuscation

### Usage Example

```kotlin
// Your Expo module usage here
import expo.modules.awswaf.AWSWafMobileModule
```

### Build Status

Check the build status and available versions at:
- [JitPack Status](https://jitpack.io/#kashif-javaid-plt/expo-aws-waf)
- [GitHub Releases](https://github.com/kashif-javaid-plt/expo-aws-waf/releases)

### Troubleshooting

If you encounter build issues:
1. Check [JitPack build logs](https://jitpack.io/#kashif-javaid-plt/expo-aws-waf)
2. Ensure you're using a released version tag
3. Clear Gradle cache: `./gradlew clean`