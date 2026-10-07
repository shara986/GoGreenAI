package com.gogreen.api.repository;

import com.gogreen.api.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    Optional<CartItem> findByCartIdAndPlantId(UUID cartId, UUID plantId);

    void deleteByCartId(UUID cartId);
}
