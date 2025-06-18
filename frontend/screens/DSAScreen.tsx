import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotBot from '../components/MascotBot';

export default function DSAScreen() {
  const showMascot = false; // Toggle to true to enable mascot

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DSA Screen</Text>

      {showMascot && (
        <View style={styles.mascotWrapper}>
          <MascotBot
            image={require('../assets/bit.png')}
            messages={[
              "Let's brute-force this!",
              "JK, O(log n).",
              "You ever BFS a tree just for fun?",
              "Memoize it. Trust me.",
              "Hash me outside, how 'bout that?",
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
