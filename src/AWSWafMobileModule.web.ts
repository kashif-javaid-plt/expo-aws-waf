import { registerWebModule, NativeModule } from 'expo';

import { AWSWafMobileModuleEvents } from './AWSWafMobile.types';

class AWSWafMobileModule extends NativeModule<AWSWafMobileModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(AWSWafMobileModule, 'AWSWafMobileModule');
