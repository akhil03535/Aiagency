import apiClient from './apiClient';

async function list() {
  const { data } = await apiClient.get('/business-profile');
  return data.data.profiles;
}

async function get(id) {
  const { data } = await apiClient.get(`/business-profile/${id}`);
  return data.data.profile;
}

async function create(payload) {
  const { data } = await apiClient.post('/business-profile', payload);
  return data.data.profile;
}

async function update(id, payload) {
  const { data } = await apiClient.put(`/business-profile/${id}`, payload);
  return data.data.profile;
}

async function remove(id) {
  const { data } = await apiClient.delete(`/business-profile/${id}`);
  return data;
}

async function setDefault(id) {
  const { data } = await apiClient.patch(`/business-profile/${id}/set-default`);
  return data.data.profile;
}

export default { list, get, create, update, remove, setDefault };
