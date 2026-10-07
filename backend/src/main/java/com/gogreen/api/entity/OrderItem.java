package com.gogreen.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /**
     * Nullable — plant may be deleted later but the order record must remain intact.
     * The plant name and price are stored in plantName and priceAtPurchase.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id")
    private Plant plant;

    /**
     * Snapshot of plant name at purchase time.
     * Remains correct even if the plant name changes later.
     */
    @NotBlank
    @Column(name = "plant_name", nullable = false)
    private String plantName;

    @Column(name = "plant_image_url")
    private String plantImageUrl;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    /**
     * Snapshot of plant price at purchase time.
     * Remains correct even if the plant price changes later.
     */
    @NotNull
    @Column(name = "price_at_purchase", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceAtPurchase;

    /**
     * priceAtPurchase × quantity — pre-computed for convenience.
     */
    @NotNull
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal subtotal;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
