# Installation Guide

## Installing AWS WAF Mobile SDK from GitHub Packages

### 1. Add GitHub Packages Repository

Add this to your app's `build.gradle` file:

```gradle
repositories {
    maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/kashif-javaid-plt/expo-aws-waf")
        credentials {
            username = project.findProperty("gpr.user") ?: System.getenv("USERNAME")
            password = project.findProperty("gpr.key") ?: System.getenv("TOKEN")
        }
    }
}
```

### 2. Add Dependency

Add this to your dependencies section:

```gradle
dependencies {
    implementation 'com.amazonaws.waf:mobilesdk:1.0.0'
    
    // Required dependencies
    implementation 'com.google.code.gson:gson:2.8.9'
    implementation 'org.bouncycastle:bcprov-jdk15to18:1.80'
}
```

### 3. Set Up Authentication

GitHub Packages requires authentication even for public packages. Create a GitHub Personal Access Token with `read:packages` permission.

#### Option A: gradle.properties (Recommended)
Create/update `gradle.properties` in your project root:
```properties
gpr.user=your-github-username
gpr.key=your-github-token
```

#### Option B: Environment Variables
Set these environment variables:
```bash
export USERNAME=your-github-username
export TOKEN=your-github-token
```

### 4. Alternative: Public Maven Repository

For easier public access without authentication, consider publishing to:
- **Maven Central** - Most accessible but requires verification
- **JitPack** - Automatically builds from GitHub releases
- **JCenter** (deprecated but still works for existing packages)

## Example for JitPack (No Authentication Required)

1. Create a GitHub release with the .aar file
2. Users can then add:

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.kashif-javaid-plt:expo-aws-waf:1.0.0'
}
```