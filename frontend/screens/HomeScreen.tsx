import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotBot from '../components/MascotBot';

export default function HomeScreen() {
  const showMascot = false; // Toggle to true to enable mascot

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>

      {showMascot && (
        <View style={styles.mascotWrapper}>
          <MascotBot
            image={require('../assets/debug.png')}
            messages={[
              "Debug believes in you.",
              "Design, then code.",
              "Break problems down.",
              "DSA isn't scary. You're scarier.",
              "Ask 'why' before 'how'.",
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mascotWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
