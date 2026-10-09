package com.gogreen.api.repository;

import com.gogreen.api.entity.Nursery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NurseryRepository extends JpaRepository<Nursery, UUID> {

    /**
     * Fetch the first nursery owned by a specific user.
     */
    Optional<Nursery> findFirstByUserId(UUID userId);

    /**
     * Fetch all nurseries owned by a specific user.
     */
    List<Nursery> findByUserId(UUID userId);

    /**
     * Check if a nursery already exists for a specific user.
     */
    boolean existsByUserId(UUID userId);

    /**
     * Return the single nursery in the system (ordered by creation for safety).
     */
    Optional<Nursery> findFirstByOrderByCreatedAtAsc();

    /**
     * Search nurseries by name, city, address, or postal code.
     */
    @org.springframework.data.jpa.repository.Query(
        "SELECT n FROM Nursery n WHERE LOWER(n.city) LIKE LOWER(CONCAT('%', :query, '%')) " +
        "OR LOWER(n.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
        "OR LOWER(n.address) LIKE LOWER(CONCAT('%', :query, '%')) " +
        "OR LOWER(n.postalCode) LIKE LOWER(CONCAT('%', :query, '%'))"
    )
    java.util.List<Nursery> searchNurseries(@org.springframework.data.repository.query.Param("query") String query);
}
