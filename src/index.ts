// Reexport the native module. On web, it will be resolved to AWSWafMobileModule.web.ts
// and on native platforms to AWSWafMobileModule.ts
export { default } from './AWSWafMobileModule';
export { default as AWSWafMobileView } from './AWSWafMobileView';
export * from  './AWSWafMobile.types';
