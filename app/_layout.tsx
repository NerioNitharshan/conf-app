import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native'; // Assuming sonner-native is the correct import

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Stack.Screen name="search" options={{ title: 'Search' }} />
        <Stack.Screen name="session-detail" options={{ title: 'Session Detail' }} />
        <Stack.Screen name="speaker-detail" options={{ title: 'Speaker Detail' }} />
        <Stack.Screen name="exhibitor-detail" options={{ title: 'Exhibitor Detail' }} />
      </Stack>
      <Toaster />
    </SafeAreaProvider>
  );
};

export default RootLayout;
