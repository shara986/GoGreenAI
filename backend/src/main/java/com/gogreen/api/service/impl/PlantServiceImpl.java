package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.PlantRequest;
import com.gogreen.api.dto.response.PlantResponse;
import com.gogreen.api.dto.response.PlantStatisticsResponse;
import com.gogreen.api.entity.Category;
import com.gogreen.api.entity.Nursery;
import com.gogreen.api.entity.Plant;
import com.gogreen.api.entity.PlantType;
import com.gogreen.api.entity.User;
import com.gogreen.api.exception.BusinessRuleException;
import com.gogreen.api.exception.DuplicateResourceException;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.mapper.PlantMapper;
import com.gogreen.api.repository.CategoryRepository;
import com.gogreen.api.repository.NurseryRepository;
import com.gogreen.api.repository.PlantRepository;
import com.gogreen.api.repository.UserRepository;
import com.gogreen.api.service.PlantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlantServiceImpl implements PlantService {

    private final PlantRepository plantRepository;
    private final NurseryRepository nurseryRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PlantMapper plantMapper;

    // ==========================================
    // Public / Customer APIs
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<PlantResponse> getPublicPlants(String search, UUID categoryId, PlantType plantType, Pageable pageable) {
        return plantRepository.searchPublicPlants(search, categoryId, plantType, pageable)
                .map(plantMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PlantResponse getPublicPlantById(UUID id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
        if (!plant.isActive()) {
            throw new ResourceNotFoundException("Plant", "id", id);
        }
        return plantMapper.toResponse(plant);
    }

    // ==========================================
    // Nursery Owner APIs
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<PlantResponse> getNurseryOwnerPlants(String ownerUsername, Pageable pageable) {
        return getNurseryOwnerPlants(ownerUsername, null, null, null, null, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlantResponse> getNurseryOwnerPlants(String ownerUsername, String search, UUID categoryId, PlantType plantType, Boolean active, Pageable pageable) {
        Nursery nursery = getNurseryForOwner(ownerUsername);
        return plantRepository.searchNurseryOwnerPlants(nursery.getId(), search, categoryId, plantType, active, pageable)
                .map(plantMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PlantResponse getNurseryOwnerPlantById(UUID id, String ownerUsername) {
        Nursery nursery = getNurseryForOwner(ownerUsername);
        Plant plant = plantRepository.findByIdAndNurseryId(id, nursery.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
        return plantMapper.toResponse(plant);
    }

    @Override
    @Transactional
    public PlantResponse createPlant(PlantRequest request, String ownerUsername) {
        Nursery nursery = getNurseryForOwner(ownerUsername);

        if (plantRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Plant with SKU '" + request.getSku() + "' already exists.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Plant plant = plantMapper.toEntity(request);
        plant.setNursery(nursery);
        plant.setCategory(category);
        plant.setActive(true); // Automatically set active = true

        plant = plantRepository.save(plant);
        log.info("Plant created for Nursery {}: {} (SKU: {})", nursery.getName(), plant.getName(), plant.getSku());
        return plantMapper.toResponse(plant);
    }

    @Override
    @Transactional
    public PlantResponse updatePlant(UUID id, PlantRequest request, String ownerUsername) {
        Nursery nursery = getNurseryForOwner(ownerUsername);

        Plant plant = plantRepository.findByIdAndNurseryId(id, nursery.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));

        if (!plant.getSku().equals(request.getSku()) && plantRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Plant with SKU '" + request.getSku() + "' already exists.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        plantMapper.updateFromRequest(request, plant);
        plant.setCategory(category);
        plant = plantRepository.save(plant);

        log.info("Plant updated: {} (SKU: {})", plant.getName(), plant.getSku());
        return plantMapper.toResponse(plant);
    }

    @Override
    @Transactional
    public PlantResponse deactivatePlant(UUID id, String ownerUsername) {
        Nursery nursery = getNurseryForOwner(ownerUsername);

        Plant plant = plantRepository.findByIdAndNurseryId(id, nursery.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));

        plant.setActive(false); // Soft deletion
        plant = plantRepository.save(plant);
        log.info("Plant deactivated (soft deleted): {}", id);
        return plantMapper.toResponse(plant);
    }

    @Override
    @Transactional
    public PlantResponse activatePlant(UUID id, String ownerUsername) {
        Nursery nursery = getNurseryForOwner(ownerUsername);

        Plant plant = plantRepository.findByIdAndNurseryId(id, nursery.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));

        plant.setActive(true);
        plant = plantRepository.save(plant);
        log.info("Plant activated: {}", id);
        return plantMapper.toResponse(plant);
    }

    @Override
    @Transactional(readOnly = true)
    public PlantStatisticsResponse getNurseryPlantStatistics(String ownerUsername) {
        Nursery nursery = getNurseryForOwner(ownerUsername);
        UUID nurseryId = nursery.getId();

        long total = plantRepository.countByNurseryId(nurseryId);
        long active = plantRepository.countByNurseryIdAndActiveTrue(nurseryId);
        long inactive = plantRepository.countByNurseryIdAndActiveFalse(nurseryId);
        long lowStock = plantRepository.countByNurseryIdAndStockLessThanEqual(nurseryId, 5);

        return PlantStatisticsResponse.builder()
                .totalPlants(total)
                .activePlants(active)
                .inactivePlants(inactive)
                .lowStockPlants(lowStock)
                .build();
    }

    // ==========================================
    // Admin APIs
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<PlantResponse> getAdminPlants(String search, UUID categoryId, PlantType plantType, Boolean active, Pageable pageable) {
        return plantRepository.searchAdminPlants(search, categoryId, plantType, active, pageable)
                .map(plantMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PlantResponse getAdminPlantById(UUID id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
        return plantMapper.toResponse(plant);
    }

    @Override
    @Transactional
    public PlantResponse setPlantActiveStatus(UUID id, boolean active) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
        plant.setActive(active);
        plant = plantRepository.save(plant);
        log.info("Admin set plant {} active status to: {}", id, active);
        return plantMapper.toResponse(plant);
    }

    @Override
    @Transactional
    public void hardDeletePlant(UUID id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", id));
        plantRepository.delete(plant);
        log.info("Admin deleted plant: {}", id);
    }

    private Nursery getNurseryForOwner(String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", ownerUsername));
        return nurseryRepository.findFirstByOrderByCreatedAtAsc()
                .orElseThrow(() -> new BusinessRuleException(
                    "No nursery found. Please set up the nursery first."));
    }
}
