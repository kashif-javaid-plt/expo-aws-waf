import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type AWSWafMobileModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onTokenGenerated: (params: TokenGeneratedEventPayload) => void;
  onError: (params: ErrorEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type TokenGeneratedEventPayload = {
  token: string;
};

export type ErrorEventPayload = {
  error: string;
  code?: number;
};

export type WAFConfiguration = {
  applicationIntegrationUrl: string;
  domainName: string;
  jsPath?: string;
  backgroundRefreshEnabled?: boolean;
  setTokenCookie?: boolean;
};

export type AWSWafMobileViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
