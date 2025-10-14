import { requireNativeView } from 'expo';
import * as React from 'react';

import { AWSWafMobileViewProps } from './AWSWafMobile.types';

const NativeView: React.ComponentType<AWSWafMobileViewProps> =
  requireNativeView('AWSWafMobile');

export default function AWSWafMobileView(props: AWSWafMobileViewProps) {
  return <NativeView {...props} />;
}
