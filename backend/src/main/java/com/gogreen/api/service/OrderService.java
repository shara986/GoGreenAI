package com.gogreen.api.service;

import com.gogreen.api.dto.request.PlaceOrderRequest;
import com.gogreen.api.dto.request.UpdateOrderStatusRequest;
import com.gogreen.api.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponse placeOrder(String username, PlaceOrderRequest request);

    Page<OrderResponse> getCustomerOrders(String username, Pageable pageable);

    OrderResponse getCustomerOrderById(String username, UUID orderId);

    OrderResponse cancelOrder(String username, UUID orderId);

    // Nursery Owner operations
    Page<OrderResponse> getAllOrders(Pageable pageable);

    OrderResponse updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request);
}
