import apiClient from './apiClient';

async function generate(payload) {
  const { data } = await apiClient.post('/generate', payload);
  return data.data; // { generation, output }
}

async function regenerate(generationId) {
  const { data } = await apiClient.post(`/generate/${generationId}/regenerate`);
  return data.data;
}

export default { generate, regenerate };
