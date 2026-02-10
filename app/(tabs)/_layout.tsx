import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/navigation/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import colors from '@/constants/nativewindColors';
import { useColorScheme } from '@/hooks/use-color-scheme';

const _layout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[colorScheme ?? 'light'].content.accent,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(analysis)"
        options={{
          title: 'Analyse',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bar-chart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(transactions)"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(categories)"
        options={{
          title: 'Customize',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pie-chart.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

export default _layout;