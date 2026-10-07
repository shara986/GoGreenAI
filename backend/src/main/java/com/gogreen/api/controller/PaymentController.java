package com.gogreen.api.controller;

import com.gogreen.api.dto.request.PaymentRequest;
import com.gogreen.api.dto.response.ApiResponse;
import com.gogreen.api.dto.response.PaymentResponse;
import com.gogreen.api.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * POST /api/payments
     * Customer processes payment for their own order.
     * Amount is NOT accepted from client — verified server-side from order total.
     */
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentRequest request) {
        PaymentResponse payment = paymentService.processPayment(userDetails.getUsername(), request);
        String message = payment.getPaymentStatus().name().equals("SUCCESS")
                ? "Payment successful"
                : "Order placed with Cash on Delivery";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(payment, message));
    }

    /**
     * GET /api/payments/order/{orderId}
     * Customer retrieves their own payment details for a specific order.
     */
    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID orderId) {
        PaymentResponse payment = paymentService.getPaymentByOrderId(userDetails.getUsername(), orderId);
        return ResponseEntity.ok(ApiResponse.success(payment, "Payment retrieved successfully."));
    }
}
