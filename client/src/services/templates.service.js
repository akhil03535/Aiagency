import apiClient from './apiClient';

async function list({ category, businessType } = {}) {
  const { data } = await apiClient.get('/templates', { params: { category, businessType } });
  return data.data.templates;
}

async function listCategories() {
  const { data } = await apiClient.get('/templates/categories');
  return data.data.categories;
}

export default { list, listCategories };
