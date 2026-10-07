import apiClient from './apiClient';

/**
 * Process a payment for an order.
 * NOTE: amount is NOT sent — the backend verifies it from the order server-side.
 *
 * @param {Object} payload - { orderId: string, paymentMethod: 'UPI' | 'COD' }
 */
export const createPayment = async (payload) => {
  const response = await apiClient.post('/payments', payload);
  return response.data;
};

/**
 * Retrieve payment details for a specific order.
 * @param {string} orderId - UUID of the order
 */
export const getPaymentByOrderId = async (orderId) => {
  const response = await apiClient.get(`/payments/order/${orderId}`);
  return response.data;
};
