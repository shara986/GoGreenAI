package com.gogreen.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlaceOrderRequest {

    @NotBlank(message = "Shipping name is required")
    @Size(min = 2, max = 100)
    private String shippingName;

    @Size(max = 20)
    private String shippingPhone;

    @NotBlank(message = "Shipping address is required")
    @Size(max = 300)
    private String shippingAddress;

    @NotBlank(message = "Shipping city is required")
    @Size(max = 100)
    private String shippingCity;

    @Size(max = 20)
    private String shippingPostalCode;
}
