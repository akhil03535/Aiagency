/**
 * Auth API calls. Kept separate from AuthContext so the raw HTTP layer
 * is testable independently of React state.
 */
import apiClient from './apiClient';

async function register({ name, email, password }) {
  const { data } = await apiClient.post('/auth/register', { name, email, password });
  return data.data; // { user, accessToken }
}

async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data.data; // { user, accessToken }
}

async function logout() {
  const { data } = await apiClient.post('/auth/logout');
  return data;
}

async function getMe() {
  const { data } = await apiClient.get('/auth/me');
  return data.data.user;
}

export default { register, login, logout, getMe };
