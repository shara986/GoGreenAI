package com.gogreen.api.controller;

import com.gogreen.api.dto.request.PlaceOrderRequest;
import com.gogreen.api.dto.response.ApiResponse;
import com.gogreen.api.dto.response.OrderResponse;
import com.gogreen.api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ------------------------------------------------
    // Customer endpoints
    // ------------------------------------------------

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PlaceOrderRequest request) {
        OrderResponse order = orderService.placeOrder(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(order, "Order placed successfully."));
    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<OrderResponse> orders = orderService.getCustomerOrders(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(orders, "Orders retrieved successfully."));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderResponse>> getMyOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID orderId) {
        OrderResponse order = orderService.getCustomerOrderById(userDetails.getUsername(), orderId);
        return ResponseEntity.ok(ApiResponse.success(order, "Order retrieved successfully."));
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID orderId) {
        OrderResponse order = orderService.cancelOrder(userDetails.getUsername(), orderId);
        return ResponseEntity.ok(ApiResponse.success(order, "Order cancelled successfully."));
    }

    // ------------------------------------------------
    // Nursery Owner endpoints
    // ------------------------------------------------

    @GetMapping("/nursery")
    @PreAuthorize("hasRole('NURSERY_OWNER')")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getAllOrders(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(ApiResponse.success(orders, "All orders retrieved successfully."));
    }

    @PutMapping("/nursery/{orderId}/status")
    @PreAuthorize("hasRole('NURSERY_OWNER')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable UUID orderId,
            @Valid @RequestBody com.gogreen.api.dto.request.UpdateOrderStatusRequest request) {
        OrderResponse order = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(ApiResponse.success(order, "Order status updated successfully."));
    }
}
