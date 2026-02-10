/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// POTENTIALLY OBSOLETE: 

import { Platform } from 'react-native';

const tintColorLight = '#1f7a8c';
const tintColorDark = '#e1e5f2';

export const Colors = {
  light: {
    text: '#022b3a',
    background: '#fff',
    tint: tintColorLight,
    icon: '#0f384c6',
    tabIconDefault: '#0f384c6',
    tabIconSelected: tintColorLight,
    item: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#022b3a',
    tint: tintColorDark,
    icon: '#bfdbf7',
    tabIconDefault: '#bfdbf7',
    tabIconSelected: tintColorDark,
    item: tintColorDark,
  },
};

import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme(); // "light" | "dark"
  return scheme === "dark" ? Colors.dark : Colors.light;
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
