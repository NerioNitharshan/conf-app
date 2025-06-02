import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// It's good practice to use useSafeAreaInsets if padding needs to be dynamic,
// but for direct style replication, we might initially hardcode or simplify.
// For now, let's keep it simple and match the previous structure.
// If `useSafeAreaInsets` is crucial, it would require this component to be a hook or use a Consumer.
// Expo Router's Tabs component might handle safe area internally for tabBarStyle,
// or we might need to adjust this later.

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false, // Usually, tabs don't have their own header unless specified
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'index') { // 'index' will be our 'Home'
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'my-schedule') { // Adjusted name for file-based routing
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'exhibitors') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'map') {
            iconName = focused ? 'map' : 'map-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
        // The tabBarStyle might need adjustment.
        // The original code used `insets.bottom`.
        // Expo Router's Tabs might handle this, or we might need a more specific solution
        // if the default behavior isn't satisfactory.
        // For now, a simplified style:
        tabBarStyle: {
          // height: 60, // Let's test default height first
          paddingBottom: 5, // Simplified padding
          paddingTop: 5,
        },
      })}
    >
      <Tabs.Screen
        name="index" // This will correspond to app/(tabs)/index.tsx
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="schedule" // app/(tabs)/schedule.tsx
        options={{
          title: 'Schedule',
        }}
      />
      <Tabs.Screen
        name="my-schedule" // app/(tabs)/my-schedule.tsx
        options={{
          title: 'My Schedule',
        }}
      />
      <Tabs.Screen
        name="exhibitors" // app/(tabs)/exhibitors.tsx
        options={{
          title: 'Exhibitors',
        }}
      />
      <Tabs.Screen
        name="map" // app/(tabs)/map.tsx
        options={{
          title: 'Map',
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
