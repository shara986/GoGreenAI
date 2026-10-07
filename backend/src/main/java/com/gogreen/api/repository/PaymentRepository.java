package com.gogreen.api.repository;

import com.gogreen.api.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(UUID orderId);

    /**
     * Check if an order already has a successful payment.
     */
    @Query("SELECT COUNT(p) > 0 FROM Payment p WHERE p.order.id = :orderId AND p.paymentStatus = 'SUCCESS'")
    boolean existsSuccessfulPaymentForOrder(@Param("orderId") UUID orderId);
}
