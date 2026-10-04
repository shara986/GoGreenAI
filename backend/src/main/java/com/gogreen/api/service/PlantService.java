package com.gogreen.api.service;

import com.gogreen.api.dto.request.PlantRequest;
import com.gogreen.api.dto.response.PlantResponse;
import com.gogreen.api.dto.response.PlantStatisticsResponse;
import com.gogreen.api.entity.PlantType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PlantService {

    // Public / Customer
    Page<PlantResponse> getPublicPlants(String search, UUID categoryId, PlantType plantType, Pageable pageable);

    PlantResponse getPublicPlantById(UUID id);

    // Nursery Owner
    Page<PlantResponse> getNurseryOwnerPlants(String ownerUsername, Pageable pageable);

    PlantResponse getNurseryOwnerPlantById(UUID id, String ownerUsername);

    PlantResponse createPlant(PlantRequest request, String ownerUsername);

    PlantResponse updatePlant(UUID id, PlantRequest request, String ownerUsername);

    PlantResponse deactivatePlant(UUID id, String ownerUsername);

    PlantResponse activatePlant(UUID id, String ownerUsername);

    PlantStatisticsResponse getNurseryPlantStatistics(String ownerUsername);

    // Admin
    Page<PlantResponse> getAdminPlants(String search, UUID categoryId, PlantType plantType, Boolean active, Pageable pageable);

    PlantResponse getAdminPlantById(UUID id);

    PlantResponse setPlantActiveStatus(UUID id, boolean active);

    void hardDeletePlant(UUID id);
}
