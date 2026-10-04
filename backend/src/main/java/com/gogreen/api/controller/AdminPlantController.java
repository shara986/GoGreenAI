package com.gogreen.api.controller;

import com.gogreen.api.dto.response.ApiResponse;
import com.gogreen.api.dto.response.PlantResponse;
import com.gogreen.api.entity.PlantType;
import com.gogreen.api.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/plants")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminPlantController {

    private final PlantService plantService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PlantResponse>>> getAdminPlants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) PlantType plantType,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(size = 12, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<PlantResponse> plants = plantService.getAdminPlants(search, categoryId, plantType, active, pageable);
        return ResponseEntity.ok(ApiResponse.success(plants, "Plants retrieved successfully."));
    }

    @GetMapping("/{plantId}")
    public ResponseEntity<ApiResponse<PlantResponse>> getAdminPlantById(@PathVariable UUID plantId) {
        PlantResponse plant = plantService.getAdminPlantById(plantId);
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant retrieved successfully."));
    }

    @PutMapping("/{plantId}/disable")
    public ResponseEntity<ApiResponse<PlantResponse>> disablePlant(@PathVariable UUID plantId) {
        PlantResponse plant = plantService.setPlantActiveStatus(plantId, false);
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant disabled successfully."));
    }

    @PutMapping("/{plantId}/enable")
    public ResponseEntity<ApiResponse<PlantResponse>> enablePlant(@PathVariable UUID plantId) {
        PlantResponse plant = plantService.setPlantActiveStatus(plantId, true);
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant enabled successfully."));
    }

    @DeleteMapping("/{plantId}")
    public ResponseEntity<ApiResponse<Void>> deletePlant(@PathVariable UUID plantId) {
        plantService.hardDeletePlant(plantId);
        return ResponseEntity.ok(ApiResponse.success(null, "Plant deleted successfully."));
    }
}
