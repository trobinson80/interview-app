import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SystemDesignScreen from './screens/SystemDesignScreen';
import BehavioralScreen from './screens/BehavoiralScreen';
import DSAScreen from './screens/DSAScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChallengesScreen from './screens/ChallengesScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        headerRight: () =>
          route.name !== 'Profile' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile' as never)}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="person-circle-outline" size={28} color="#000" />
            </TouchableOpacity>
          ),
        tabBarStyle: route.name === 'Profile' ? { display: 'none' } : undefined,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline';
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'System Design':
              iconName = 'git-network-outline';
              break;
            case 'Behavioral':
              iconName = 'chatbubble-ellipses-outline';
              break;
            case 'DSA':
              iconName = 'code-slash-outline';
              break;
            case 'Challenges':
              iconName = 'checkmark-done-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="System Design" component={SystemDesignScreen} />
      <Tab.Screen name="Behavioral" component={BehavioralScreen} />
      <Tab.Screen name="DSA" component={DSAScreen} />
      <Tab.Screen name="Challenges" component={ChallengesScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user ? `✅ Logged in as ${user.email}` : '🔒 Not signed in');
      setInitialRoute(user ? 'Main' : 'Login');
    });

    return unsubscribe;
  }, []);

  if (!initialRoute) return null; // prevent flash before auth check completes

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
