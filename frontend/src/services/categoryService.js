import apiClient from './apiClient';

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};
