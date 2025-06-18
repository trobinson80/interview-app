import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotBot from '../components/MascotBot';

export default function SystemDesignScreen() {
  const showMascot = false; // Toggle to true to enable mascot

  return (
    <View style={styles.container}>
      <Text style={styles.text}>System Design Screen</Text>

      {showMascot && (
        <View style={styles.mascotWrapper}>
          <MascotBot
            image={require('../assets/archie.png')}
            messages={[
              "Let's scale this plan.",
              "Every node has a purpose.",
              "Throughput beats latency (sometimes).",
              "Cache like a king, fallback like a pro.",
              "What if it spikes 10x?",
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
  mascotWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
