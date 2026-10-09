package com.gogreen.api.controller;

import com.gogreen.api.dto.request.PlantRequest;
import com.gogreen.api.dto.response.ApiResponse;
import com.gogreen.api.dto.response.PlantResponse;
import com.gogreen.api.dto.response.PlantStatisticsResponse;
import com.gogreen.api.service.PlantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import com.gogreen.api.entity.PlantType;

@RestController
@RequestMapping("/nursery/plants")
@PreAuthorize("hasRole('NURSERY_OWNER')")
@RequiredArgsConstructor
public class NurseryPlantController {

    private final PlantService plantService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PlantResponse>>> getNurseryOwnerPlants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) PlantType plantType,
            @RequestParam(required = false) Boolean active,
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<PlantResponse> plants = plantService.getNurseryOwnerPlants(userDetails.getUsername(), search, categoryId, plantType, active, pageable);
        return ResponseEntity.ok(ApiResponse.success(plants, "Nursery plants retrieved successfully."));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<PlantStatisticsResponse>> getNurseryPlantStatistics(
            @AuthenticationPrincipal UserDetails userDetails) {
        PlantStatisticsResponse statistics = plantService.getNurseryPlantStatistics(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(statistics, "Nursery plant statistics retrieved successfully."));
    }

    @GetMapping("/{plantId}")
    public ResponseEntity<ApiResponse<PlantResponse>> getNurseryOwnerPlantById(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal UserDetails userDetails) {
        PlantResponse plant = plantService.getNurseryOwnerPlantById(plantId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant retrieved successfully."));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlantResponse>> createPlant(
            @Valid @RequestBody PlantRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        PlantResponse plant = plantService.createPlant(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(plant, "Plant created successfully."));
    }

    @PutMapping("/{plantId}")
    public ResponseEntity<ApiResponse<PlantResponse>> updatePlant(
            @PathVariable UUID plantId,
            @Valid @RequestBody PlantRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        PlantResponse plant = plantService.updatePlant(plantId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant updated successfully."));
    }

    @PutMapping("/{plantId}/disable")
    public ResponseEntity<ApiResponse<PlantResponse>> disablePlant(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal UserDetails userDetails) {
        PlantResponse plant = plantService.deactivatePlant(plantId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant deactivated successfully."));
    }

    @PutMapping("/{plantId}/enable")
    public ResponseEntity<ApiResponse<PlantResponse>> enablePlant(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal UserDetails userDetails) {
        PlantResponse plant = plantService.activatePlant(plantId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant activated successfully."));
    }

    @DeleteMapping("/{plantId}")
    public ResponseEntity<ApiResponse<Void>> deletePlant(
            @PathVariable UUID plantId,
            @AuthenticationPrincipal UserDetails userDetails) {
        plantService.deleteNurseryPlant(plantId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null, "Plant permanently deleted."));
    }
}
