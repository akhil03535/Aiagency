import apiClient from './apiClient';

async function list() {
  const { data } = await apiClient.get('/favorites');
  return data.data.favorites;
}

async function add(generationId) {
  const { data } = await apiClient.post(`/favorites/${generationId}`);
  return data;
}

async function remove(generationId) {
  const { data } = await apiClient.delete(`/favorites/${generationId}`);
  return data;
}

export default { list, add, remove };
