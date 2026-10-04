package com.gogreen.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    private String description;

    private String imageUrl;
}
