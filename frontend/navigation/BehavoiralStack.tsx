import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BehavioralScreen from '../screens/BehavoiralScreen';
import PreviousSessionsScreen from '../screens/PreviousSessionsScreen';

const Stack = createNativeStackNavigator();

export default function BehavioralStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BehavioralScreen"
        component={BehavioralScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreviousSessions"
        component={PreviousSessionsScreen}
        options={{ title: 'Previous Sessions' }}
      />
    </Stack.Navigator>
  );
}
