// src/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // ✅ Fallback for local dev
  withCredentials: true, // ✅ Include cookies for session handling
});

// Handle 401 globally (session expired)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('🔐 Session expired or unauthorized. Redirecting...');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else {
      console.error('❌ API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
