import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import SpeakersScreen from './screens/SpeakersScreen';
import ExhibitorsScreen from './screens/ExhibitorsScreen';
import MapScreen from './screens/MapScreen';
import MyScheduleScreen from './screens/MyScheduleScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SearchScreen from './screens/SearchScreen';

// Create stack and tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screen for any missing screens
const PlaceholderScreen = ({ route }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is a placeholder for {route.name}</Text>
    </View>
  );
};

// Main tab navigator
const MainTabs = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'My Schedule') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Exhibitors') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingBottom: Math.max(insets.bottom, 5),
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="My Schedule" component={MyScheduleScreen} />
      <Tab.Screen name="Exhibitors" component={ExhibitorsScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
};

// Root stack navigator
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainTabs">
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen name="MySchedule" component={MyScheduleScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="SessionDetail" component={PlaceholderScreen} />
          <Stack.Screen name="SpeakerDetail" component={PlaceholderScreen} />
          <Stack.Screen name="ExhibitorDetail" component={PlaceholderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toaster />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// Export the App component as default
export default App;