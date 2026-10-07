import apiClient from './apiClient';

export const placeOrder = async (shippingData) => {
  const response = await apiClient.post('/orders', shippingData);
  return response.data;
};

export const getMyOrders = async (params = {}) => {
  const response = await apiClient.get('/orders', { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await apiClient.put(`/orders/${orderId}/cancel`);
  return response.data;
};

// Nursery Owner
export const getNurseryOrders = async (params = {}) => {
  const response = await apiClient.get('/orders/nursery', { params });
  return response.data;
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await apiClient.put(`/orders/nursery/${orderId}/status`, { orderStatus });
  return response.data;
};
