import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

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

type RootStackParamList = {
  SessionDetail: { session: Session };
};

export default function SessionDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'SessionDetail'>>();
  const { session } = route.params;

  const starKeys: (keyof FeedbackResponse)[] = ['situation', 'task', 'action', 'result'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Question</Text>
        <Text style={styles.body}>{session.question}</Text>

        <Text style={styles.header}>Feedback</Text>
        {starKeys.map((key) => {
          const section = session.feedback[key] as StarSection;
          return (
            <View key={key} style={styles.feedbackSection}>
              <Text style={styles.subheader}>{key.toUpperCase()}</Text>
              <Text>{section.response}</Text>
              <Text style={styles.score}>Clarity: {section.clarity_score} | Completeness: {section.completeness_score}</Text>
            </View>
          );
        })}

        <Text style={styles.overall}>📊 Overall Score: {session.feedback.overall_score}</Text>
        <Text style={styles.body}>{session.feedback.feedback}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subheader: {
    fontWeight: '600',
    marginTop: 12,
  },
  score: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  overall: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 14,
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  feedbackSection: {
    marginBottom: 10,
  },
});
