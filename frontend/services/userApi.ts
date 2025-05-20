import axios from 'axios';
import { auth } from './firebase';

const API_BASE = 'http://localhost:8000';

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
