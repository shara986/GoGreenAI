import apiClient from './apiClient';

export const getPlants = async (params) => {
  const response = await apiClient.get('/plants', { params });
  return response.data;
};

export const getPlantById = async (id) => {
  const response = await apiClient.get(`/plants/${id}`);
  return response.data;
};

export const searchPlants = async (searchQuery, filters = {}) => {
  const params = { search: searchQuery, ...filters };
  const response = await apiClient.get('/plants', { params });
  return response.data;
};

// Nursery Owner specific API calls
export const getNurseryPlants = async (params) => {
  const response = await apiClient.get('/nursery/plants', { params });
  return response.data;
};

export const getNurseryPlantById = async (id) => {
  const response = await apiClient.get(`/nursery/plants/${id}`);
  return response.data;
};

export const createPlant = async (data) => {
  const response = await apiClient.post('/nursery/plants', data);
  return response.data;
};

export const updatePlant = async (id, data) => {
  const response = await apiClient.put(`/nursery/plants/${id}`, data);
  return response.data;
};

export const disablePlant = async (id) => {
  const response = await apiClient.put(`/nursery/plants/${id}/disable`);
  return response.data;
};

export const enablePlant = async (id) => {
  const response = await apiClient.put(`/nursery/plants/${id}/enable`);
  return response.data;
};

export const getPlantStatistics = async () => {
  const response = await apiClient.get('/nursery/plants/statistics');
  return response.data;
};
