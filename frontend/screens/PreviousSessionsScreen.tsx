import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PreviousSessionsScreen() {
  const [view, setView] = useState<'sessions' | 'data'>('sessions');
  const [range, setRange] = useState<'7' | '30'>('7');
  const { width } = useWindowDimensions();
  const isWideScreen = width > 800;
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.wrapper, isWideScreen && styles.wrapperWide]}>
        <View style={styles.toggleBar}>
          <TouchableOpacity
            style={[styles.toggleButton, view === 'sessions' && styles.activeButton]}
            onPress={() => setView('sessions')}
          >
            <Text style={styles.toggleText}>Previous Sessions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, view === 'data' && styles.activeButton]}
            onPress={() => setView('data')}
          >
            <Text style={styles.toggleText}>Data</Text>
          </TouchableOpacity>
        </View>

        {view === 'sessions' ? (
          <View style={styles.content}><Text>List of previous sessions will go here</Text></View>
        ) : (
          <View style={styles.content}>
            <View style={styles.rangeToggle}>
              <TouchableOpacity
                style={[styles.rangeButton, range === '7' && styles.activeRange]}
                onPress={() => setRange('7')}
              >
                <Text style={styles.rangeText}>Last 7 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rangeButton, range === '30' && styles.activeRange]}
                onPress={() => setRange('30')}
              >
                <Text style={styles.rangeText}>Last 30 Days</Text>
              </TouchableOpacity>
            </View>
            <Text>Line chart placeholder ({range}-day view)</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 32,
  },
  wrapper: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  wrapperWide: {
    maxWidth: 700,
  },
  toggleBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  toggleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  activeRange: {
    backgroundColor: '#007bff',
  },
  rangeText: {
    fontWeight: '600',
  },
});