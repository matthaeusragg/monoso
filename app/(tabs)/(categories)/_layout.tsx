import "@/styles/global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen name="categories" options={{ headerShown: false }} />
        {/* <Stack.Screen name="category" options={{ headerShown: false }} /> */}
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
