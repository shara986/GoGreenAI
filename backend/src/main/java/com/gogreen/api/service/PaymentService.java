package com.gogreen.api.service;

import com.gogreen.api.dto.request.PaymentRequest;
import com.gogreen.api.dto.response.PaymentResponse;

import java.util.UUID;

public interface PaymentService {

    /**
     * Process a payment for an order. Validates ownership and order state server-side.
     *
     * @param username the authenticated customer's username (from JWT — not trusted from client)
     * @param request  contains orderId and paymentMethod only
     * @return PaymentResponse with payment and order status
     */
    PaymentResponse processPayment(String username, PaymentRequest request);

    /**
     * Retrieve payment details for a given order. Enforces ownership check.
     *
     * @param username the authenticated customer's username
     * @param orderId  the order UUID
     * @return PaymentResponse or throws if not found / not owned
     */
    PaymentResponse getPaymentByOrderId(String username, UUID orderId);
}
