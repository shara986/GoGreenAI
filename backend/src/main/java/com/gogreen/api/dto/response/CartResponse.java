package com.gogreen.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private UUID id;
    private List<CartItemResponse> items;
    private int totalItems;
    private BigDecimal totalAmount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private UUID id;
        private UUID plantId;
        private String plantName;
        private String imageUrl;
        private BigDecimal price;
        private Integer quantity;
        private Integer stock;
        private BigDecimal subtotal;
        private boolean active;
    }
}
