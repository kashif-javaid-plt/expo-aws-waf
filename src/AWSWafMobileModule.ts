import { NativeModule, requireNativeModule } from 'expo';

import { AWSWafMobileModuleEvents, WAFConfiguration } from './AWSWafMobile.types';

declare class AWSWafMobileModule extends NativeModule<AWSWafMobileModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  
  // AWS WAF specific methods
  initialize(config: WAFConfiguration): Promise<void>;
  generateToken(): Promise<string>;
  isInitialized(): boolean;
  getVersion(): string;
  
  // Cookie management methods
  setTokenCookie(enabled: boolean): Promise<void>;
  getTokenCookie(): Promise<string | null>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AWSWafMobileModule>('AWSWafMobile');
