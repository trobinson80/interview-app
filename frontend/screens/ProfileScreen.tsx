import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { getUserProfile, saveUserProfile } from '../services/userApi';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 600;
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [tracks, setTracks] = useState<string[]>([]);

  const experienceOptions = ['0–2', '3–6', '7–10', '10+'];
  const goalOptions = [
    'Land my first SWE job',
    'Transition to backend',
    'Get promoted',
    'Pass interviews at FAANG',
    'Build interview confidence',
  ];
  const trackOptions = ['System Design', 'Behavioral', 'DSA'];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setName(profile.name || '');
        setEmail(profile.email || auth.currentUser?.email || '');
        setExperience(profile.experience || '');
        setGoal(profile.goal || '');
        setTracks(profile.tracks || []);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    loadProfile();
  }, []);

  const toggleTrack = (track: string) => {
    setTracks(prev =>
      prev.includes(track) ? prev.filter(t => t !== track) : [...prev, track]
    );
  };

  const handleSave = async () => {
    try {
      await saveUserProfile({ name, email, experience, goal, tracks });
      alert('Profile updated!');
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Error updating profile.');
    }
  };

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, isWideScreen && styles.innerWide]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Profile</Text>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          placeholder="Your name"
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <Text style={styles.readonly}>{email}</Text>

        <Text style={styles.label}>Years of Experience</Text>
        <View style={styles.pillRow}>
          {experienceOptions.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.pill,
                experience === opt && styles.pillSelected,
              ]}
              onPress={() => setExperience(opt)}
            >
              <Text
                style={[
                  styles.pillText,
                  experience === opt && styles.pillTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Goals</Text>
        <View style={styles.pillRow}>
          {goalOptions.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.pill,
                goal === opt && styles.pillSelected,
              ]}
              onPress={() => setGoal(opt)}
            >
              <Text
                style={[
                  styles.pillText,
                  goal === opt && styles.pillTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Focus Track(s)</Text>
        <View style={styles.pillRow}>
          {trackOptions.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.pill,
                tracks.includes(opt) && styles.pillSelected,
              ]}
              onPress={() => toggleTrack(opt)}
            >
              <Text
                style={[
                  styles.pillText,
                  tracks.includes(opt) && styles.pillTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f4f4f4',
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0.25,
    shadowRadius: 8,
  },
  innerWide: {
    maxWidth: 500,
    padding: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007bff',
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 6,
  },
  readonly: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  pillSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  pillText: {
    color: '#333',
    fontSize: 14,
  },
  pillTextSelected: {
    color: '#fff',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
