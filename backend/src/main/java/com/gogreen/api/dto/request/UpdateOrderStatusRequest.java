package com.gogreen.api.dto.request;

import com.gogreen.api.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {

    @NotNull(message = "orderStatus is required")
    private OrderStatus orderStatus;
}
