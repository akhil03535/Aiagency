import apiClient from './apiClient';

async function getDashboard() {
  const { data } = await apiClient.get('/admin/dashboard');
  return data.data;
}

async function listUsers({ search, role, page = 1, limit = 20 } = {}) {
  const { data } = await apiClient.get('/admin/users', {
    params: { search, role, page, limit },
  });
  return { users: data.data.users, meta: data.meta };
}

async function setUserActiveStatus(userId, isActive) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/status`, { isActive });
  return data.data.user;
}

async function setUserRole(userId, role) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return data.data.user;
}

async function listActivityLogs({ action, page = 1, limit = 50 } = {}) {
  const { data } = await apiClient.get('/admin/logs', { params: { action, page, limit } });
  return { logs: data.data.logs, meta: data.meta };
}

export default {
  getDashboard,
  listUsers,
  setUserActiveStatus,
  setUserRole,
  listActivityLogs,
};
