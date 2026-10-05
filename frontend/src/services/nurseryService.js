import apiClient from './apiClient';

export const getNurseryProfile = async () => {
  try {
    const response = await apiClient.get('/nursery/profile');
    return response.data;
  } catch (err) {
    const response = await apiClient.get('/nursery');
    return response.data;
  }
};

export const createNurseryProfile = async (data) => {
  const response = await apiClient.post('/nursery', data);
  return response.data;
};

export const updateNurseryProfile = async (data) => {
  const response = await apiClient.put('/nursery', data);
  return response.data;
};
