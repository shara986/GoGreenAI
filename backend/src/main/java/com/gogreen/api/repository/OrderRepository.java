package com.gogreen.api.repository;

import com.gogreen.api.entity.Order;
import com.gogreen.api.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Page<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId, Pageable pageable);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    Optional<Order> findByIdAndCustomerId(UUID orderId, UUID customerId);

    // For nursery owner — all orders since single nursery
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items oi LEFT JOIN FETCH oi.plant ORDER BY o.createdAt DESC")
    List<Order> findAllWithItemsOrderByCreatedAtDesc();

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    boolean existsByCustomerIdAndOrderStatus(UUID customerId, OrderStatus status);
}
