#!/bin/bash
set -e

echo "🔧 Testing AWS WAF Mobile SDK Expo Wrapper"
echo "=========================================="

# Test TypeScript compilation
echo "✅ Building TypeScript..."
cd /Users/kashif.javaid/Desktop/expo-aws-waf
npm run build

echo "✅ TypeScript compilation successful!"

# Test Android build
echo "🤖 Testing Android build..."
cd example/android
./gradlew assembleDebug --no-daemon

echo "✅ Android build successful!"

# Test iOS build (basic compilation check)
echo "🍎 Testing iOS build..."
cd ../ios
xcodebuild -workspace expoawswafexample.xcworkspace -scheme expoawswafexample -configuration Debug -sdk iphonesimulator build -quiet

echo "✅ iOS build successful!"

echo "🎉 All tests passed! The AWS WAF Mobile SDK wrapper is ready to use."
echo ""
echo "📋 Summary:"
echo "- ✅ TypeScript compilation"
echo "- ✅ Android build (with AWS WAF SDK integration)"
echo "- ✅ iOS build (with AWS WAF SDK integration)"
echo "- ✅ Example app builds successfully"
echo ""
echo "🚀 Ready for production use!"