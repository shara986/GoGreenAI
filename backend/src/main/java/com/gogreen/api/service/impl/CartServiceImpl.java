package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.AddToCartRequest;
import com.gogreen.api.dto.request.UpdateCartItemRequest;
import com.gogreen.api.dto.response.CartResponse;
import com.gogreen.api.entity.Cart;
import com.gogreen.api.entity.CartItem;
import com.gogreen.api.entity.Plant;
import com.gogreen.api.entity.User;
import com.gogreen.api.exception.BusinessRuleException;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.repository.CartItemRepository;
import com.gogreen.api.repository.CartRepository;
import com.gogreen.api.repository.PlantRepository;
import com.gogreen.api.repository.UserRepository;
import com.gogreen.api.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;

    // =========================================================
    // GET CART
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(String username) {
        User user = resolveUser(username);
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseGet(() -> createEmptyCart(user));
        return toCartResponse(cart);
    }

    // =========================================================
    // ADD TO CART
    // =========================================================
    @Override
    @Transactional
    public CartResponse addToCart(String username, AddToCartRequest request) {
        User user = resolveUser(username);
        Plant plant = resolvePlant(request.getPlantId());

        validatePlantAvailable(plant);
        validateStockSufficient(plant, request.getQuantity());

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createAndSaveEmptyCart(user));

        // Check if plant already in cart → increase quantity
        Optional<CartItem> existing = cartItemRepository.findByCartIdAndPlantId(cart.getId(), plant.getId());
        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (newQty > plant.getStock()) {
                throw new BusinessRuleException(
                    "Only " + plant.getStock() + " units of '" + plant.getName() + "' are available. " +
                    "You already have " + item.getQuantity() + " in your cart."
                );
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .plant(plant)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
            cartItemRepository.save(item);
        }

        log.info("Added plant '{}' × {} to cart for user '{}'", plant.getName(), request.getQuantity(), username);
        return toCartResponse(cartRepository.findByUserIdWithItems(user.getId()).orElseThrow());
    }

    // =========================================================
    // UPDATE CART ITEM
    // =========================================================
    @Override
    @Transactional
    public CartResponse updateCartItem(String username, UUID cartItemId, UpdateCartItemRequest request) {
        User user = resolveUser(username);
        CartItem item = resolveCartItem(cartItemId, user.getId());
        Plant plant = item.getPlant();

        validatePlantAvailable(plant);
        validateStockSufficient(plant, request.getQuantity());

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        log.info("Updated cart item '{}' quantity to {} for user '{}'", cartItemId, request.getQuantity(), username);
        return toCartResponse(cartRepository.findByUserIdWithItems(user.getId()).orElseThrow());
    }

    // =========================================================
    // REMOVE CART ITEM
    // =========================================================
    @Override
    @Transactional
    public CartResponse removeCartItem(String username, UUID cartItemId) {
        User user = resolveUser(username);
        CartItem item = resolveCartItem(cartItemId, user.getId());
        cartItemRepository.delete(item);
        log.info("Removed cart item '{}' for user '{}'", cartItemId, username);
        return toCartResponse(cartRepository.findByUserIdWithItems(user.getId()).orElseThrow());
    }

    // =========================================================
    // CLEAR CART
    // =========================================================
    @Override
    @Transactional
    public void clearCart(String username) {
        User user = resolveUser(username);
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
        log.info("Cleared cart for user '{}'", username);
    }

    // =========================================================
    // INTERNAL HELPERS
    // =========================================================

    private User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    private Plant resolvePlant(UUID plantId) {
        return plantRepository.findById(plantId)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId));
    }

    private CartItem resolveCartItem(UUID cartItemId, UUID userId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", cartItemId));
        // Security: ensure the cart item belongs to this user's cart
        if (!item.getCart().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Cart item", "id", cartItemId);
        }
        return item;
    }

    private void validatePlantAvailable(Plant plant) {
        if (!plant.isActive()) {
            throw new BusinessRuleException("'" + plant.getName() + "' is no longer available.");
        }
        if (plant.getStock() <= 0) {
            throw new BusinessRuleException("'" + plant.getName() + "' is currently out of stock.");
        }
    }

    private void validateStockSufficient(Plant plant, int quantity) {
        if (quantity > plant.getStock()) {
            throw new BusinessRuleException(
                "Only " + plant.getStock() + " units of '" + plant.getName() + "' are available."
            );
        }
    }

    private Cart createEmptyCart(User user) {
        return Cart.builder().user(user).build();
    }

    private Cart createAndSaveEmptyCart(User user) {
        Cart cart = Cart.builder().user(user).build();
        return cartRepository.save(cart);
    }

    // =========================================================
    // MAPPING
    // =========================================================

    CartResponse toCartResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        BigDecimal total = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = itemResponses.stream()
                .mapToInt(CartResponse.CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalItems(totalItems)
                .totalAmount(total)
                .build();
    }

    private CartResponse.CartItemResponse toItemResponse(CartItem item) {
        Plant plant = item.getPlant();
        BigDecimal subtotal = plant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartResponse.CartItemResponse.builder()
                .id(item.getId())
                .plantId(plant.getId())
                .plantName(plant.getName())
                .imageUrl(plant.getImageUrl())
                .price(plant.getPrice())
                .quantity(item.getQuantity())
                .stock(plant.getStock())
                .subtotal(subtotal)
                .active(plant.isActive())
                .build();
    }
}
