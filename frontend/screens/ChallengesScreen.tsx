import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

export default function ChallengesScreen() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [inProgress, setInProgress] = useState<string[]>([]);

  // Example mock data — replace with backend fetch
  useEffect(() => {
    setCompleted([
      'Behavioral: Tell me about a time...',
      'DSA: Reverse a linked list',
    ]);
    setInProgress([
      'System Design: URL shortener',
      'Behavioral: Biggest challenge you’ve overcome',
    ]);
  }, []);

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.header}>Challenges & Progress</Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          {inProgress.map((challenge, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardText}>{challenge}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Completed</Text>
          {completed.map((challenge, idx) => (
            <View key={idx} style={[styles.card, styles.cardCompleted]}>
              <Text style={styles.cardText}>{challenge}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0.25,
    shadowRadius: 6,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#e7f0ff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardCompleted: {
    backgroundColor: '#d1f7e1',
  },
  cardText: {
    fontSize: 14,
  },
});
