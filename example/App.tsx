import { useEvent } from 'expo';
import AWSWafMobile, { AWSWafMobileView } from 'expo-aws-waf';
import { Alert, Button, ScrollView, Text, View, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import { AWS_WAF_APPLICATION_INTEGRATION_URL, AWS_WAF_DOMAIN_NAME, HTTPBIN_URL } from '@env';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [cookieEnabled, setCookieEnabled] = useState(true);

  const onChangePayload = useEvent(AWSWafMobile, 'onChange');
  const onTokenGenerated = useEvent(AWSWafMobile, 'onTokenGenerated');
  const onError = useEvent(AWSWafMobile, 'onError');

  useEffect(() => {
    setIsInitialized(AWSWafMobile.isInitialized());
  }, []);

  useEffect(() => {
    if (onTokenGenerated?.token) {
      setCurrentToken(onTokenGenerated.token);
      console.log('New token generated:', onTokenGenerated.token);
    }
  }, [onTokenGenerated]);

  useEffect(() => {
    if (onError?.error) {
      console.error('WAF Error:', onError.error);
      Alert.alert('WAF Error', onError.error);
    }
  }, [onError]);

  const initializeWAF = async () => {
    try {
      await AWSWafMobile.initialize({
        applicationIntegrationUrl: AWS_WAF_APPLICATION_INTEGRATION_URL,
        domainName: AWS_WAF_DOMAIN_NAME,
        backgroundRefreshEnabled: true,
        setTokenCookie: cookieEnabled,
      });
      setIsInitialized(true);
      Alert.alert('Success', 'WAF SDK initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert('Error', 'Failed to initialize WAF SDK');
    }
  };

  const generateToken = async () => {
    try {
      const token = await AWSWafMobile.generateToken();
      setCurrentToken(token);
      Alert.alert('Token Generated', `Token: ${token.substring(0, 20)}...`);
    } catch (error) {
      console.error('Token generation error:', error);
      Alert.alert('Error', 'Failed to generate token');
    }
  };

  const toggleCookieMode = async () => {
    try {
      const newCookieEnabled = !cookieEnabled;
      await AWSWafMobile.setTokenCookie(newCookieEnabled);
      setCookieEnabled(newCookieEnabled);
      Alert.alert('Cookie Mode', `Cookie mode ${newCookieEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Cookie toggle error:', error);
      Alert.alert('Error', 'Failed to toggle cookie mode');
    }
  };

  const getTokenCookie = async () => {
    try {
      const cookie = await AWSWafMobile.getTokenCookie();
      if (cookie) {
        Alert.alert('Token Cookie', cookie);
      } else {
        Alert.alert('Token Cookie', 'No cookie available');
      }
    } catch (error) {
      console.error('Get cookie error:', error);
      Alert.alert('Error', 'Failed to get token cookie');
    }
  };

  const testIntegrationURL = async () => {
    try {
      const testUrl = AWS_WAF_APPLICATION_INTEGRATION_URL;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': AWS_WAF_DOMAIN_NAME,
          'Referer': AWS_WAF_DOMAIN_NAME,
        },
      });
      
      console.log('Integration URL Status:', response.status);
      Alert.alert('Integration Test', `URL Status: ${response.status}\nURL is ${response.ok ? 'reachable' : 'unreachable'}`);
      
    } catch (error) {
      console.error('Integration URL test failed:', error);
      Alert.alert('Integration Test', `Failed to reach integration URL\nError: ${error.message}`);
    }
  };

  const testTokenWithAPI = async () => {
    if (!currentToken) {
      Alert.alert('No Token', 'Please generate a token first');
      return;
    }

    try {
      const apiUrl = HTTPBIN_URL;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-aws-waf-token': currentToken,
        },
      });
      
      console.log('API Response Status:', response.status);
      const responseText = await response.text();
      console.log('API Response:', responseText);
      
      if (response.status === 403) {
        Alert.alert('❌ Token Invalid', 'WAF blocked the request - token is not valid');
      } else if (response.status === 200) {
        Alert.alert('✅ Token Valid', 'Request successful - check console for headers');
      } else {
        Alert.alert('API Test', `Response Status: ${response.status}\nCheck console for details`);
      }
      
    } catch (error) {
      console.error('API test failed:', error);
      Alert.alert('API Test Failed', `Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <ScrollView style={styles.scrollContainer}>
          <Text style={styles.header}>AWS WAF Mobile SDK</Text>
          
          <Group name="SDK Status">
            <Text>Initialized: {isInitialized ? 'Yes' : 'No'}</Text>
            <Text>Cookie Mode: {cookieEnabled ? 'Enabled' : 'Disabled'}</Text>
          </Group>

          <Group name="Initialization">
            <Button
              title="Initialize WAF"
              onPress={initializeWAF}
              disabled={isInitialized}
            />
          </Group>

          <Group name="Token Management">
            <Button
              title="Generate Token"
              onPress={generateToken}
              disabled={!isInitialized}
            />
            {currentToken && (
              <Text style={styles.token}>
                Current Token: {currentToken.substring(0, 20)}...
              </Text>
            )}
          </Group>

          <Group name="Cookie Management">
            <Button
              title={`${cookieEnabled ? 'Disable' : 'Enable'} Cookie Mode`}
              onPress={toggleCookieMode}
            />
            <Button
              title="Get Token Cookie"
              onPress={getTokenCookie}
              disabled={!cookieEnabled}
            />
          </Group>

          <Group name="Events">
            <Text>Last Change: {onChangePayload?.value}</Text>
            <Text>Last Token: {onTokenGenerated?.token ? 'Generated' : 'None'}</Text>
            <Text>Last Error: {onError?.error ? 'Check console' : 'None'}</Text>
          </Group>

          <Group name="Testing">
            <Button
              title="Test Token with API"
              onPress={testTokenWithAPI}
              disabled={!currentToken}
            />
          </Group>

          <Group name="Protected Content">
            <AWSWafMobileView
              url="https://httpbin.org/headers"
              onLoad={({ nativeEvent: { url } }) => console.log(`Loaded: ${url}`)}
              style={styles.view}
            />
          </Group>
      </ScrollView>
    </View>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold' as const,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: Constants.statusBarHeight,
  },
  scrollContainer: {
    flex: 1,
  },
  view: {
    flex: 1,
    height: 200,
  },
  token: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
};
