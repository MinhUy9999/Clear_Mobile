import { RootState } from '@/app/store/store';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://192.168.100.27:5000/api' // Địa chỉ IP của máy tính khi dùng Expo
  : 'http://localhost:5000/api'; // Địa chỉ cho web (local)

// Các hàm API
export const registerUser = async (userData: {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  mobile: string;
}) => {
  return await axios.post(`${BASE_URL}/user/register`, userData);
};

export const loginUser = async (email: string, password: string) => {
  return await axios.post(`${BASE_URL}/user/login`, { email, password });
};
export const forgotPassword = async (email: string) => {
  return await axios.post(`${BASE_URL}/user/forgotpassword`, { email });
};
export const resetPassword = async (token: string, password: string) => {
  return await axios.put(`${BASE_URL}/user/resetpassword`, { token, password });
};
export const logoutUser = async () => {
  try {
    return await axios.get(
      `${BASE_URL}/user/logout`,
      {},
      {
        withCredentials: true, 
      }
    );
  } catch (error) {
    console.error('Error during logout:', error.response || error.message);
    throw error; // Rethrow the error to handle it in the caller
  }
};


export const getCurrentUser = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error.response || error.message);
    throw error;
  }
};


export const updateCurrentUser = async (userData: FormData, getState: () => RootState) => {
  const state = getState();
  const token = state.user.token;

  const response = await axios.put(`${BASE_URL}/user/current`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};