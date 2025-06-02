import React from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // To get route name if needed

const PlaceholderScreen = () => {
  const params = useLocalSearchParams(); // In case you want to display the route name
  // For expo-router, the concept of `route.name` passed as a prop is different.
  // Screen names are derived from file names.
  // We can use `useLocalSearchParams` or other hooks if specific data is needed.
  // For a generic placeholder, just a simple message is fine.
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is a placeholder screen.</Text>
      {/* If you need to show which screen it is, you might pass params or have specific text */}
    </View>
  );
};
export default PlaceholderScreen;
