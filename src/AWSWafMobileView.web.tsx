import * as React from 'react';

import { AWSWafMobileViewProps } from './AWSWafMobile.types';

export default function AWSWafMobileView(props: AWSWafMobileViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
