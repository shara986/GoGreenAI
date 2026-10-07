package com.gogreen.api.dto.response;

import com.gogreen.api.entity.OrderStatus;
import com.gogreen.api.entity.PaymentMethod;
import com.gogreen.api.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private UUID id;
    private String customerName;
    private String customerUsername;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;

    // Payment snapshot — null if payment has not been processed yet
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private UUID paymentId;

    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPostalCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private UUID id;
        private UUID plantId;
        private String plantName;
        private String plantImageUrl;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
        private BigDecimal subtotal;
    }
}
