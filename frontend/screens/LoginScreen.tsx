import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { login, signUp } from '../services/auth';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const { width } = useWindowDimensions();
  const isWideScreen = width > 600;
  const navigation = useNavigation();

  const handleAuth = async () => {
    console.log("Button has been clicked")
    try {
      const user = isLogin ? await login(email, password) : await signUp(email, password)
      console.log("Auth Success: ", user)
      navigation.reset({
        index: 0,
        routes: [{name: 'Main' as never}]
      });
    } catch (err: any) {
      console.log('Error during auth:', err);
      setError(err.message);
    }
  };

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, isWideScreen && styles.innerWide]}>
        <Text style={styles.header}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title={isLogin ? 'Login' : 'Sign Up'} onPress={handleAuth} />
        <Text style={styles.toggle} onPress={() => setIsLogin(!isLogin)}>
          <Text>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Text>
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
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
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  toggle: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007bff',
  },
  error: {
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
  },
});
