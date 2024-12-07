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