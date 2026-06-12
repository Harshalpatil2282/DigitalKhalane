/**
 * Axios API Service
 * All API calls go through this configured instance
 * Smart baseURL detection for Vercel (relative) vs local/external (absolute)
 */

import axios from 'axios';

// Determine base URL
// - On Vercel: use relative '/api' (proxied by Vercel)
// - Local dev: use VITE_API_URL or localhost:5000
// - External API: use VITE_API_URL
const getBaseURL = () => {
  // Check if we're on Vercel (VERCEL env var is auto-set)
  if (import.meta.env.VERCEL) {
    return '/api';
  }
  // Check for explicit API URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Default local development
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  withCredentials: true, // Important for cookies if used
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('dk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dk_token');
      localStorage.removeItem('dk_user');
      // Optionally redirect to login
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;