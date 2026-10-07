package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.PlaceOrderRequest;
import com.gogreen.api.dto.request.UpdateOrderStatusRequest;
import com.gogreen.api.dto.response.OrderResponse;
import com.gogreen.api.entity.*;
import com.gogreen.api.exception.BusinessRuleException;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.repository.*;
import com.gogreen.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    // Valid transitions the nursery owner may apply
    private static final List<OrderStatus> NURSERY_OWNER_ALLOWED_STATUSES =
            List.of(OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    // Statuses where customer cancellation is allowed
    private static final List<OrderStatus> CANCELLABLE_STATUSES =
            List.of(OrderStatus.PENDING, OrderStatus.CONFIRMED);

    // =========================================================
    // PLACE ORDER — fully server-side, transactional
    // =========================================================
    @Override
    @Transactional
    public OrderResponse placeOrder(String username, PlaceOrderRequest request) {
        User customer = resolveUser(username);

        // Load cart with items
        Cart cart = cartRepository.findByUserIdWithItems(customer.getId())
                .orElseThrow(() -> new BusinessRuleException("Your cart is empty. Please add items before placing an order."));

        if (cart.getItems().isEmpty()) {
            throw new BusinessRuleException("Your cart is empty. Please add items before placing an order.");
        }

        // Validate all plants, compute totals, reduce stock — all in one transaction
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Plant plant = cartItem.getPlant();

            // Re-fetch with lock to prevent race condition
            plant = plantRepository.findById(plant.getId())
                    .orElseThrow(() -> new BusinessRuleException("Plant '" + cartItem.getPlant().getName() + "' no longer exists."));

            if (!plant.isActive()) {
                throw new BusinessRuleException("'" + plant.getName() + "' is no longer available.");
            }
            if (plant.getStock() < cartItem.getQuantity()) {
                throw new BusinessRuleException(
                    "Only " + plant.getStock() + " units of '" + plant.getName() + "' are available. " +
                    "Please update your cart and try again."
                );
            }

            // Reduce stock
            plant.setStock(plant.getStock() - cartItem.getQuantity());
            plantRepository.save(plant);

            // Snapshot item
            BigDecimal price = plant.getPrice();
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            orderItems.add(OrderItem.builder()
                    .plant(plant)
                    .plantName(plant.getName())
                    .plantImageUrl(plant.getImageUrl())
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(price)
                    .subtotal(subtotal)
                    .build());
        }

        // Create Order
        Order order = Order.builder()
                .customer(customer)
                .totalAmount(totalAmount)
                .orderStatus(OrderStatus.PENDING)
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .shippingPostalCode(request.getShippingPostalCode())
                .build();

        order = orderRepository.save(order);

        // Associate items with order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.getItems().addAll(orderItems);
        order = orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        log.info("Order '{}' placed by '{}' for ₹{}", order.getId(), username, totalAmount);
        return toOrderResponse(order);
    }

    // =========================================================
    // CUSTOMER — get own orders
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getCustomerOrders(String username, Pageable pageable) {
        User customer = resolveUser(username);
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId(), pageable)
                .map(this::toOrderResponse);
    }

    // =========================================================
    // CUSTOMER — get specific order (owns-check enforced)
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getCustomerOrderById(String username, UUID orderId) {
        User customer = resolveUser(username);
        Order order = orderRepository.findByIdAndCustomerId(orderId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return toOrderResponse(order);
    }

    // =========================================================
    // CUSTOMER — cancel order
    // =========================================================
    @Override
    @Transactional
    public OrderResponse cancelOrder(String username, UUID orderId) {
        User customer = resolveUser(username);
        Order order = orderRepository.findByIdAndCustomerId(orderId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!CANCELLABLE_STATUSES.contains(order.getOrderStatus())) {
            throw new BusinessRuleException(
                "Order cannot be cancelled. Current status: " + order.getOrderStatus() +
                ". Only PENDING or CONFIRMED orders can be cancelled."
            );
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            if (item.getPlant() != null) {
                Plant plant = item.getPlant();
                plant.setStock(plant.getStock() + item.getQuantity());
                plantRepository.save(plant);
            }
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);
        log.info("Order '{}' cancelled by '{}'", orderId, username);
        return toOrderResponse(order);
    }

    // =========================================================
    // NURSERY OWNER — all orders
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toOrderResponse);
    }

    // =========================================================
    // NURSERY OWNER — update order status
    // =========================================================
    @Override
    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        OrderStatus newStatus = request.getOrderStatus();
        validateStatusTransition(order.getOrderStatus(), newStatus);

        order.setOrderStatus(newStatus);
        order = orderRepository.save(order);
        log.info("Order '{}' status updated to '{}'", orderId, newStatus);
        return toOrderResponse(order);
    }

    // =========================================================
    // VALIDATION HELPERS
    // =========================================================

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        if (current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED) {
            throw new BusinessRuleException(
                "Cannot change status of a " + current + " order."
            );
        }
        if (!NURSERY_OWNER_ALLOWED_STATUSES.contains(next)) {
            throw new BusinessRuleException(
                "Invalid target status: " + next + ". Nursery owner can set: CONFIRMED, PROCESSING, SHIPPED, DELIVERED."
            );
        }
    }

    private User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    // =========================================================
    // MAPPING
    // =========================================================

    private OrderResponse toOrderResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .plantId(item.getPlant() != null ? item.getPlant().getId() : null)
                        .plantName(item.getPlantName())
                        .plantImageUrl(item.getPlantImageUrl())
                        .quantity(item.getQuantity())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        // Attach payment snapshot if available
        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(order.getId());

        OrderResponse.OrderResponseBuilder builder = OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getCustomer().getName())
                .customerUsername(order.getCustomer().getUsername())
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .shippingPostalCode(order.getShippingPostalCode())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt());

        paymentOpt.ifPresent(p -> builder
                .paymentId(p.getId())
                .paymentMethod(p.getPaymentMethod())
                .paymentStatus(p.getPaymentStatus()));

        return builder.build();
    }
}
