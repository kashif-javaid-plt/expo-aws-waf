# expo-aws-waf

AWS Mobile WAF Wrapper for Expo applications.

## Description

This Expo module provides a wrapper for AWS Web Application Firewall (WAF) Mobile SDK, enabling React Native applications to integrate with AWS WAF for enhanced security and protection against common web exploits.

## Installation

```bash
npm install expo-aws-waf
```

## Usage

### Basic Setup

```typescript
import AWSWafMobile, { AWSWafMobileView } from 'expo-aws-waf';
import { useEvent } from 'expo';

// Listen to WAF events
const onTokenGenerated = useEvent(AWSWafMobile, 'onTokenGenerated');
const onError = useEvent(AWSWafMobile, 'onError');
const onChange = useEvent(AWSWafMobile, 'onChange');
```

### Configuration

Initialize the AWS WAF Mobile SDK with your configuration:

```typescript
const wafConfig = {
  applicationIntegrationUrl: 'https://your-waf-integration-url.com',
  domainName: 'https://your-domain.com',
  backgroundRefreshEnabled: true, // Optional, default: false
  setTokenCookie: true // Optional, default: false
};

// Initialize the SDK
await AWSWafMobile.initialize(wafConfig);
```

### Core Functions

#### 1. Initialize WAF SDK

```typescript
const initializeWAF = async () => {
  try {
    await AWSWafMobile.initialize({
      applicationIntegrationUrl: 'https://your-integration-url.com',
      domainName: 'https://your-domain.com',
      backgroundRefreshEnabled: true,
      setTokenCookie: true,
    });
    console.log('WAF SDK initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
  }
};
```

#### 2. Check Initialization Status

```typescript
const isInitialized = AWSWafMobile.isInitialized();
console.log('SDK Status:', isInitialized ? 'Ready' : 'Not initialized');
```

#### 3. Generate WAF Token

```typescript
const generateToken = async () => {
  try {
    const token = await AWSWafMobile.generateToken();
    console.log('Generated token:', token);
    return token;
  } catch (error) {
    console.error('Token generation failed:', error);
  }
};
```

#### 4. Cookie Management

```typescript
// Enable/disable token cookie storage
await AWSWafMobile.setTokenCookie(true); // Enable
await AWSWafMobile.setTokenCookie(false); // Disable

// Retrieve stored token cookie
const tokenCookie = await AWSWafMobile.getTokenCookie();
if (tokenCookie) {
  console.log('Retrieved cookie token:', tokenCookie);
} else {
  console.log('No token cookie available');
}
```

### Using WAF Tokens in HTTP Requests

Once you have a token, include it in your API requests:

```typescript
const makeProtectedRequest = async (token: string) => {
  try {
    const response = await fetch('https://your-protected-api.com/endpoint', {
      method: 'GET',
      headers: {
        'x-aws-waf-token': token,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 403) {
      console.log('Request blocked by WAF - token may be invalid');
    } else {
      console.log('Request successful');
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};
```

### WAF Mobile View Component

Use the `AWSWafMobileView` component to display protected content:

```typescript
import { AWSWafMobileView } from 'expo-aws-waf';

<AWSWafMobileView
  url="https://your-protected-content.com"
  onLoad={({ nativeEvent: { url } }) => {
    console.log(`Loaded: ${url}`);
  }}
  style={{
    flex: 1,
    height: 300,
  }}
/>
```

### Event Handling

Listen to WAF events throughout your application:

```typescript
import { useEvent } from 'expo';

const MyComponent = () => {
  // Listen for token generation events
  const onTokenGenerated = useEvent(AWSWafMobile, 'onTokenGenerated');
  
  // Listen for errors
  const onError = useEvent(AWSWafMobile, 'onError');
  
  // Listen for value changes
  const onChange = useEvent(AWSWafMobile, 'onChange');

  useEffect(() => {
    if (onTokenGenerated?.token) {
      console.log('New token received:', onTokenGenerated.token);
      // Use the token for your requests
    }
  }, [onTokenGenerated]);

  useEffect(() => {
    if (onError?.error) {
      console.error('WAF Error:', onError.error, 'Code:', onError.code);
      // Handle the error appropriately
    }
  }, [onError]);

  // ... rest of component
};
```

### Complete Example

```typescript
import React, { useState, useEffect } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { useEvent } from 'expo';
import AWSWafMobile, { AWSWafMobileView } from 'expo-aws-waf';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

  const onTokenGenerated = useEvent(AWSWafMobile, 'onTokenGenerated');
  const onError = useEvent(AWSWafMobile, 'onError');

  useEffect(() => {
    setIsInitialized(AWSWafMobile.isInitialized());
  }, []);

  useEffect(() => {
    if (onTokenGenerated?.token) {
      setCurrentToken(onTokenGenerated.token);
    }
  }, [onTokenGenerated]);

  useEffect(() => {
    if (onError?.error) {
      Alert.alert('WAF Error', onError.error);
    }
  }, [onError]);

  const initializeWAF = async () => {
    try {
      await AWSWafMobile.initialize({
        applicationIntegrationUrl: 'https://your-integration-url.com',
        domainName: 'https://your-domain.com',
        backgroundRefreshEnabled: true,
        setTokenCookie: true,
      });
      setIsInitialized(true);
    } catch (error) {
      console.error('Initialization error:', error);
    }
  };

  const generateToken = async () => {
    try {
      const token = await AWSWafMobile.generateToken();
      setCurrentToken(token);
    } catch (error) {
      console.error('Token generation error:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>WAF Status: {isInitialized ? 'Initialized' : 'Not Ready'}</Text>
      
      <Button 
        title="Initialize WAF" 
        onPress={initializeWAF}
        disabled={isInitialized}
      />
      
      <Button 
        title="Generate Token" 
        onPress={generateToken}
        disabled={!isInitialized}
      />
      
      {currentToken && (
        <Text>Token: {currentToken.substring(0, 20)}...</Text>
      )}
      
      <AWSWafMobileView
        url="https://httpbin.org/headers"
        onLoad={({ nativeEvent: { url } }) => console.log(`Loaded: ${url}`)}
        style={{ flex: 1, marginTop: 20 }}
      />
    </View>
  );
}
```

## Development

### Prerequisites

- Node.js
- Expo CLI
- iOS development environment (Xcode)
- Android development environment (Android Studio)

### Scripts

- `npm run build` - Build the module
- `npm run clean` - Clean build artifacts
- `npm run lint` - Lint the code
- `npm run test` - Run tests
- `npm run open:ios` - Open iOS project in Xcode
- `npm run open:android` - Open Android project in Android Studio

### Example App

The `example/` directory contains a sample application demonstrating the module usage.

## Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web

## License

MIT

## Repository

[https://github.com/kashif-javaid-plt/expo-aws-waf](https://github.com/kashif-javaid-plt/expo-aws-waf)

## Issues

Report issues at: [https://github.com/kashif-javaid-plt/expo-aws-waf/issues](https://github.com/kashif-javaid-plt/expo-aws-waf/issues)