package com.gogreen.api.repository;

import com.gogreen.api.entity.Plant;
import com.gogreen.api.entity.PlantType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlantRepository extends JpaRepository<Plant, UUID> {

    Optional<Plant> findBySku(String sku);

    boolean existsBySku(String sku);

    Page<Plant> findByNurseryId(UUID nurseryId, Pageable pageable);

    Optional<Plant> findByIdAndNurseryId(UUID id, UUID nurseryId);

    Page<Plant> findByCategoryIdAndActiveTrue(UUID categoryId, Pageable pageable);

    Page<Plant> findByActiveTrue(Pageable pageable);

    long countByNurseryId(UUID nurseryId);

    long countByNurseryIdAndActiveTrue(UUID nurseryId);

    long countByNurseryIdAndActiveFalse(UUID nurseryId);

    long countByNurseryIdAndStockLessThanEqual(UUID nurseryId, Integer stockThreshold);

    @Query("""
        SELECT p FROM Plant p
        WHERE p.active = true
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.scientificName) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:plantType IS NULL OR p.plantType = :plantType)
    """)
    Page<Plant> searchPublicPlants(
        @Param("search") String search,
        @Param("categoryId") UUID categoryId,
        @Param("plantType") PlantType plantType,
        Pageable pageable
    );

    @Query("""
        SELECT p FROM Plant p
        WHERE (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:plantType IS NULL OR p.plantType = :plantType)
        AND (:active IS NULL OR p.active = :active)
    """)
    Page<Plant> searchAdminPlants(
        @Param("search") String search,
        @Param("categoryId") UUID categoryId,
        @Param("plantType") PlantType plantType,
        @Param("active") Boolean active,
        Pageable pageable
    );

    @Query("""
        SELECT p FROM Plant p
        WHERE p.nursery.id = :nurseryId
        AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:plantType IS NULL OR p.plantType = :plantType)
        AND (:active IS NULL OR p.active = :active)
    """)
    Page<Plant> searchNurseryOwnerPlants(
        @Param("nurseryId") UUID nurseryId,
        @Param("search") String search,
        @Param("categoryId") UUID categoryId,
        @Param("plantType") PlantType plantType,
        @Param("active") Boolean active,
        Pageable pageable
    );
}
