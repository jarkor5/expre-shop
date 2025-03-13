import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,

        tabBarStyle: {
          display: 'none',
          ...Platform.select({
            ios: {
              position: 'absolute', 
            },
            default: {},
          }),
        },
      }}
    >
    </Tabs>
  );
}
