import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';

import BookingScreen from './screens/BookingScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import CreateBookingScreen from './screens/CreateBookingScreen';
import ServiceDetailsScreen from './screens/ServiceDetailsScreen';

// Stack and Tab Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator Component
const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'Booking') {
          iconName = 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
        }

        return <Icon name={iconName as string} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />

    
    <Tab.Screen name="Booking" component={BookingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main Stack Navigator Component
const App = () => {
  return (
  
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
         <Stack.Screen name="Register" component={RegisterScreen} />
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
         <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
         <Stack.Screen name="CreateBooking" component={CreateBookingScreen} />
         <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      </Stack.Navigator>
   
  );
};

export default App;
