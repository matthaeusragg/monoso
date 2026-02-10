import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { ExpoRoot } from 'expo-router';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FallbackComponent from './components/error-handling/fallback-component';

Sentry.init({
  dsn: 'https://11d30bd1f3ada0a3d68856d946649197@o4510756209033216.ingest.de.sentry.io/4510756212375632',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
  
  // uncomment to get verbose Sentry Logger logs in console
  // debug: true,

  environment: __DEV__ ? "development" : "production",
  release: Constants.expoConfig?.version,
});

const originalHandler = ErrorUtils.getGlobalHandler();

ErrorUtils.setGlobalHandler((error, isFatal) => {
  Sentry.captureException(error);
  originalHandler?.(error, isFatal);
});


export function App() {
  const ctx = require.context('./app');
  const [rootKey, setRootKey] = useState(0);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary 
      FallbackComponent={FallbackComponent}
      onReset={() => {
        setRootKey(prev => prev+1); // hacky: changing the state variable forces a rerender of this component, i.e. the entire app. Clears all states and contexts
      }}
      onError={(error, info) => {
        // log to Sentry
        Sentry.captureException(error, { extra: { stack: info.componentStack } });
      }}
      >
          <ExpoRoot context={ctx} />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);