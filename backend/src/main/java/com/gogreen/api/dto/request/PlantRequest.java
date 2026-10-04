package com.gogreen.api.dto.request;

import com.gogreen.api.entity.PlantType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PlantRequest {

    @NotNull
    private UUID categoryId;

    @NotBlank
    @Size(min = 2, max = 150)
    private String name;

    @Size(max = 200)
    private String scientificName;

    @NotBlank
    @Size(max = 100)
    private String sku;

    private String description;

    private String careInstructions;

    @NotNull
    @DecimalMin(value = "0.01")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stock;

    @NotNull
    private PlantType plantType;

    private String imageUrl;

    private Boolean active = true;
}
