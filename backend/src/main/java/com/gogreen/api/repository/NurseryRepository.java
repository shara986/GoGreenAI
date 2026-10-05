package com.gogreen.api.repository;

import com.gogreen.api.entity.Nursery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NurseryRepository extends JpaRepository<Nursery, UUID> {

    /**
     * Fetch the nursery owned by a specific user.
     */
    Optional<Nursery> findByUserId(UUID userId);

    /**
     * Check if a nursery already exists for a specific user.
     */
    boolean existsByUserId(UUID userId);

    /**
     * Return the single nursery in the system (ordered by creation for safety).
     */
    Optional<Nursery> findFirstByOrderByCreatedAtAsc();
}
