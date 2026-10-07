package com.gogreen.api.dto.request;

import com.gogreen.api.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

/**
 * Request to process a payment.
 * NOTE: orderId and paymentMethod only — amount is NEVER trusted from the client.
 * The backend fetches and verifies the order total server-side.
 */
@Data
public class PaymentRequest {

    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
