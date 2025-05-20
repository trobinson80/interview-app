import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BehavioralScreen from '../screens/BehavoiralScreen';
import PreviousSessionsScreen from '../screens/PreviousSessionsScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';

interface StarSection {
  response: string;
  clarity_score: string;
  completeness_score: string;
}

interface FeedbackResponse {
  situation: StarSection;
  task: StarSection;
  action: StarSection;
  result: StarSection;
  overall_score: string;
  feedback: string;
}

interface Session {
  question: string;
  timestamp: string;
  feedback: FeedbackResponse;
}

export type BehavioralStackParamList = {
  BehavioralScreen: undefined;
  PreviousSessions: undefined;
  SessionDetail: { session: Session };
};

const Stack = createNativeStackNavigator<BehavioralStackParamList>();

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
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{ title: 'Session Detail' }}
      />
    </Stack.Navigator>
  );
}
