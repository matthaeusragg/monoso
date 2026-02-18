import "@/styles/global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AnalyticsProvider } from '@/context/analytics-context';
import { CategoryProvider } from '@/context/category-context';
import { SettingsProvider } from '@/context/settings-context';
import { TransactionProvider } from '@/context/transaction-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

import colors from "@/constants/nativewindColors";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { useNavigationContainerRef } from "expo-router";
import React from "react";
import { KeyboardProvider } from 'react-native-keyboard-controller';
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});
Sentry.init({
  dsn: "https://11d30bd1f3ada0a3d68856d946649197@o4510756209033216.ingest.de.sentry.io/4510756212375632",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayout() {
  const isDarkMode = useColorScheme() === 'dark';
  const ref = useNavigationContainerRef();
  React.useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  const SchemeTheme = isDarkMode ? DarkTheme : DefaultTheme;
  const CustomTheme = {
    ...SchemeTheme, 
    colors: {
      ...SchemeTheme.colors,
      ...colors[isDarkMode ? 'dark' : 'light'].theme, // overwrite what's provided in nativewindColors.ts
    }
  }

  return (
    <KeyboardProvider>
      <CategoryProvider>
        <TransactionProvider>
          <SettingsProvider>
            <AnalyticsProvider>
      <ThemeProvider value={CustomTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      </AnalyticsProvider>
      </SettingsProvider>
      </TransactionProvider>
      </CategoryProvider>
      </KeyboardProvider>
  );
}


export default Sentry.wrap(RootLayout);
