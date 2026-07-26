import apiClient from './apiClient';

async function list({ search, contentType, page = 1, limit = 20 } = {}) {
  const { data } = await apiClient.get('/history', {
    params: { search, contentType, page, limit },
  });
  return { items: data.data.items, meta: data.meta };
}

async function remove(historyId) {
  const { data } = await apiClient.delete(`/history/${historyId}`);
  return data;
}

async function getReusable(generationId) {
  const { data } = await apiClient.get(`/history/reuse/${generationId}`);
  return data.data; // { contentType, inputPayload }
}

export default { list, remove, getReusable };
