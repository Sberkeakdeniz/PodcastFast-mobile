import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { IconSymbol } from '@/src/components/ui/IconSymbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#1E293B',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              tint="dark"
              intensity={30}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          ) : null
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="episodes"
        options={{
          title: 'Episodes',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="mic.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
