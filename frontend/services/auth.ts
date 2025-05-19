import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from './firebase';
import { Storage } from './storage';

export async function signUp(email: string, password: string) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await Storage.setItem('userToken', userCred.user.uid);
  return userCred.user;
}

export async function login(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  await Storage.setItem('userToken', userCred.user.uid);
  return userCred.user;
}
