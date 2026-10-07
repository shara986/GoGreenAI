import apiClient from './apiClient';

export const getCart = async () => {
  const response = await apiClient.get('/cart');
  return response.data;
};

export const addToCart = async (plantId, quantity) => {
  const response = await apiClient.post('/cart/items', { plantId, quantity });
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  const response = await apiClient.delete(`/cart/items/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await apiClient.delete('/cart');
  return response.data;
};
