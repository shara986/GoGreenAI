package com.gogreen.api.dto.response;

import com.gogreen.api.entity.PlantType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantResponse {
    private UUID id;
    private String name;
    private String scientificName;
    private String sku;
    private String description;
    private String careInstructions;
    private BigDecimal price;
    private Integer stock;
    private PlantType plantType;
    private String imageUrl;
    private boolean active;

    private CategorySummary category;
    private NurserySummary nursery;

    private UUID categoryId;
    private String categoryName;
    private UUID nurseryId;
    private String nurseryName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySummary {
        private UUID id;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NurserySummary {
        private UUID id;
        private String name;
    }
}
