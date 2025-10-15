import { useEvent } from 'expo';
import AWSWafMobile, { AWSWafMobileView } from 'expo-aws-waf';
import { Alert, Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

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
        applicationIntegrationUrl: 'https://043f2fa08795.edge.sdk.awswaf.com/043f2fa08795/0d2c7af4ca21/',
        domainName: 'your-app-domain.com', // Your protected application's domain
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
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

        <Group name="Protected Content">
          <AWSWafMobileView
            url="https://httpbin.org/headers"
            onLoad={({ nativeEvent: { url } }) => console.log(`Loaded: ${url}`)}
            style={styles.view}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
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
