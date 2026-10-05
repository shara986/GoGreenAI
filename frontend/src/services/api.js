import apiClient from './apiClient';

export const authService = {
  registerCustomer: (data) => apiClient.post('/auth/register/customer', data),
  registerNursery: (data) => apiClient.post('/auth/register/nursery', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  isNurseryRegistrationAvailable: () => apiClient.get('/auth/nursery-registration-available'),
};

export const nurseryService = {
  getNursery: () => apiClient.get('/nursery'),
  createNursery: (data) => apiClient.post('/nursery', data),
  updateNursery: (data) => apiClient.put('/nursery', data),
};

export const categoryService = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/admin/categories', data),
  update: (id, data) => apiClient.put(`/admin/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/categories/${id}`),
};

export const plantService = {
  getPublicPlants: (params) => apiClient.get('/plants', { params }),
  getPublicPlantById: (id) => apiClient.get(`/plants/${id}`),
  getNurseryOwnerPlants: (params) => apiClient.get('/nursery/plants', { params }),
  getNurseryPlantStatistics: () => apiClient.get('/nursery/plants/statistics'),
  getNurseryPlantById: (id) => apiClient.get(`/nursery/plants/${id}`),
  createNurseryPlant: (data) => apiClient.post('/nursery/plants', data),
  updateNurseryPlant: (id, data) => apiClient.put(`/nursery/plants/${id}`, data),
  deactivateNurseryPlant: (id) => apiClient.delete(`/nursery/plants/${id}`),
  getAdminPlants: (params) => apiClient.get('/admin/plants', { params }),
  getAdminPlantById: (id) => apiClient.get(`/admin/plants/${id}`),
  disablePlant: (id) => apiClient.put(`/admin/plants/${id}/disable`),
  enablePlant: (id) => apiClient.put(`/admin/plants/${id}/enable`),
  hardDeletePlant: (id) => apiClient.delete(`/admin/plants/${id}`),
};
