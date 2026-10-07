package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.PaymentRequest;
import com.gogreen.api.dto.response.PaymentResponse;
import com.gogreen.api.entity.*;
import com.gogreen.api.exception.BusinessRuleException;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.repository.OrderRepository;
import com.gogreen.api.repository.PaymentRepository;
import com.gogreen.api.repository.UserRepository;
import com.gogreen.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // Statuses from which an order can still be paid
    private static final java.util.List<OrderStatus> PAYABLE_STATUSES =
            java.util.List.of(OrderStatus.PENDING);

    // ===========================================================
    // PROCESS PAYMENT
    // ===========================================================
    @Override
    @Transactional
    public PaymentResponse processPayment(String username, PaymentRequest request) {
        // 1. Resolve customer from JWT (never trust customerId from client)
        User customer = resolveUser(username);

        // 2. Load and verify order ownership
        Order order = orderRepository.findByIdAndCustomerId(request.getOrderId(), customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        // 3. Validate order is in a payable state
        if (!PAYABLE_STATUSES.contains(order.getOrderStatus())) {
            throw new BusinessRuleException(
                "Order cannot be paid. Current status: " + order.getOrderStatus() +
                ". Only PENDING orders can be paid."
            );
        }

        // 4. Ensure order is not cancelled
        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new BusinessRuleException("Cannot process payment for a cancelled order.");
        }

        // 5. Check if order has already been successfully paid
        if (paymentRepository.existsSuccessfulPaymentForOrder(order.getId())) {
            throw new BusinessRuleException("This order has already been paid successfully.");
        }

        // 6. Amount verified server-side — NEVER use client-supplied amount
        java.math.BigDecimal verifiedAmount = order.getTotalAmount();

        // 7. Determine result based on payment method
        //    UPI → simulate SUCCESS | COD → PENDING (collected on delivery)
        PaymentStatus paymentStatus;
        OrderStatus newOrderStatus;
        String transactionRef;

        if (request.getPaymentMethod() == PaymentMethod.UPI) {
            // Simulated UPI payment — always succeeds in demo
            paymentStatus = PaymentStatus.SUCCESS;
            newOrderStatus = OrderStatus.CONFIRMED;
            transactionRef = "DEMO-UPI-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        } else {
            // Cash on Delivery — payment collected later
            paymentStatus = PaymentStatus.PENDING;
            newOrderStatus = OrderStatus.CONFIRMED;
            transactionRef = "COD-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        }

        // 8. Create payment record (upsert: if a FAILED record exists, replace it)
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseGet(() -> Payment.builder()
                        .order(order)
                        .build());

        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(paymentStatus);
        payment.setAmount(verifiedAmount);
        payment.setTransactionReference(transactionRef);
        payment = paymentRepository.save(payment);

        // 9. Update order status
        order.setOrderStatus(newOrderStatus);
        orderRepository.save(order);

        log.info("Payment '{}' processed for order '{}' by '{}' — method={}, status={}",
                payment.getId(), order.getId(), username, request.getPaymentMethod(), paymentStatus);

        return toPaymentResponse(payment, newOrderStatus);
    }

    // ===========================================================
    // GET PAYMENT BY ORDER (customer — owns-check enforced)
    // ===========================================================
    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(String username, UUID orderId) {
        User customer = resolveUser(username);

        // Verify the order belongs to this customer
        Order order = orderRepository.findByIdAndCustomerId(orderId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));

        return toPaymentResponse(payment, order.getOrderStatus());
    }

    // ===========================================================
    // HELPERS
    // ===========================================================

    private User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private PaymentResponse toPaymentResponse(Payment payment, OrderStatus orderStatus) {
        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrder().getId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .orderStatus(orderStatus)
                .amount(payment.getAmount())
                .transactionReference(payment.getTransactionReference())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
