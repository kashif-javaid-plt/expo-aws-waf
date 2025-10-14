import { NativeModule, requireNativeModule } from 'expo';

import { AWSWafMobileModuleEvents } from './AWSWafMobile.types';

declare class AWSWafMobileModule extends NativeModule<AWSWafMobileModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AWSWafMobileModule>('AWSWafMobile');
