import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotBot from '../components/MascotBot';

export default function DSAScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>DSA Screen</Text>

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
