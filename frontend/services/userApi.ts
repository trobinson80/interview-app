import axios from 'axios';
import { auth } from './firebase';
import Constants from 'expo-constants';

// const API_BASE = 'http://localhost:8000';
const API_BASE = Constants.expoConfig?.extra?.apiBase ?? '';
export type UserProfile = {
  name: string;
  email: string;
  experience: string;
  goal: string;
  tracks: string[];
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();

  const res = await axios.get<UserProfile>(`${API_BASE}/user/profile`, {
    headers: { Authorization: token },
  });

  return res.data;
};

export const saveUserProfile = async (profileData: {
  name: string;
  email: string;
  experience: string;
  goal: string;
  tracks: string[];
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();

  const res = await axios.post(`${API_BASE}/user/profile`, profileData, {
    headers: { Authorization: token },
  });

  return res.data;
};
