/**
 * Centralized Axios instance. All API calls go through this so
 * base URL, auth headers, and error handling stay consistent.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the access token is invalid/expired, clear it so the UI doesn't
    // keep sending a dead token. Full silent refresh-token rotation is a
    // good next enhancement, but out of scope for this phase.
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
