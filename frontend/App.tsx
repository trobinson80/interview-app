import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SystemDesignScreen from './screens/SystemDesignScreen';
import BehavioralScreen from './screens/BehavoiralScreen';
import DSAScreen from './screens/DSAScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChallengesScreen from './screens/ChallengesScreen';

// Define navigation stack types
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Define type for props passed to MainTabs
type MainTabsProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

function MainTabs({ navigation }: MainTabsProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="person-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        ),
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
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Your Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
