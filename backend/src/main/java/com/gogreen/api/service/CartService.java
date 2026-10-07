package com.gogreen.api.service;

import com.gogreen.api.dto.request.AddToCartRequest;
import com.gogreen.api.dto.request.UpdateCartItemRequest;
import com.gogreen.api.dto.response.CartResponse;

import java.util.UUID;

public interface CartService {

    CartResponse getCart(String username);

    CartResponse addToCart(String username, AddToCartRequest request);

    CartResponse updateCartItem(String username, UUID cartItemId, UpdateCartItemRequest request);

    CartResponse removeCartItem(String username, UUID cartItemId);

    void clearCart(String username);
}
