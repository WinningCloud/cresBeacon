import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const ICON_SIZE = 30;

  return (

    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // blur effect on iOS
          },
           default: {
        height: 100, // 👈 for Android
        paddingBottom: 8,
        paddingTop: 8,

      },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'SpaceMono',
        },

        tabBarIconStyle:{
                marginTop:14 // Adjust icon position
        }
      }}
    >
      <Tabs.Screen
  name="index"
  options={{
    title: "Dashboard",
    tabBarIcon: ({ color, size }) => (
      <Image
        source={require("../../assets/images/dashboardIcon.png")}
        style={{ tintColor: color, width: ICON_SIZE, height: size }}
        resizeMode="contain"
      />
    ),
  }}
/>

      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
      <Image
        source={require("../../assets/images/alertIcon.png")}
        style={{ tintColor: color, width: ICON_SIZE, height: size }}
        resizeMode="contain"
      />
    ),
        }}
      />

      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
         tabBarIcon: ({ color, size }) => (
      <Image
        source={require("../../assets/images/chatbotIcon.png")}
        style={{ tintColor: color, width: ICON_SIZE, height: size }}
        resizeMode="contain"
      />
    ),
        }}
      />

   

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
         tabBarIcon: ({ color, size }) => (
      <Image
        source={require("../../assets/images/profileIcon.png")}
        style={{ tintColor: color, width: ICON_SIZE, height: size }}
        resizeMode="contain"
      />
    ),
        }}
      />
    </Tabs>
  );
}
