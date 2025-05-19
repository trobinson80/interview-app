import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotBot from '../components/MascotBot';

export default function BehavioralScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Behavioral Screen</Text>

      <MascotBot
        image={require('../assets/Echo.png')}
        messages={[
          "Take a breath—what’s your STAR?",
          "Start with the situation, then flow.",
          "Stay present. You've got this.",
          "Speak from experience, not perfection.",
          "Progress, not perfection.",
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
