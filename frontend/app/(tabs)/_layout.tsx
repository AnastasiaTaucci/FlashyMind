import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5492f7',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(explore)/explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(decks)"
        options={{
          title: 'Decks',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="book" color={color} />,
        }}
      />
      
    </Tabs>
  );
}
