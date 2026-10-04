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
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/plants")
@RequiredArgsConstructor
public class PlantController {

    private final PlantService plantService;

    /**
     * GET /plants?search=&categoryId=&plantType=&page=&size=&sort=
     * Public endpoint: list active plants only.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PlantResponse>>> getPublicPlants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String name, // Fallback alias
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) PlantType plantType,
            @PageableDefault(size = 12, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        String query = search != null ? search : name;
        Page<PlantResponse> plants = plantService.getPublicPlants(query, categoryId, plantType, pageable);
        return ResponseEntity.ok(ApiResponse.success(plants, "Plants retrieved successfully."));
    }

    /**
     * GET /plants/{id}
     * Public endpoint: details of active plant.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlantResponse>> getPublicPlantById(@PathVariable UUID id) {
        PlantResponse plant = plantService.getPublicPlantById(id);
        return ResponseEntity.ok(ApiResponse.success(plant, "Plant retrieved successfully."));
    }
}
