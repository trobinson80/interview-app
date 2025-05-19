import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../services/firebase';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Storage } from '../services/storage';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await auth.signOut();
    await Storage.deleteItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NXTRound!</Text>
      <Text style={styles.subtitle}>Choose your track and get started:</Text>

      {/* You can later replace these with real cards or icons */}
      <Button title="Behavioral" onPress={() => {}} />
      <Button title="System Design" onPress={() => {}} />
      <Button title="DSA" onPress={() => {}} />

      <View style={{ marginTop: 40 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});
