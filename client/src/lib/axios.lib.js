import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://cochat-4vrg.onrender.com/api',
  withCredentials: true
});
