package com.gogreen.api.controller;

import com.gogreen.api.dto.request.NurseryRequest;
import com.gogreen.api.dto.response.ApiResponse;
import com.gogreen.api.dto.response.NurseryResponse;
import com.gogreen.api.service.NurseryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nursery")
@RequiredArgsConstructor
public class NurseryController {

    private final NurseryService nurseryService;

    /**
     * GET /nursery - Public: get the default nursery info
     */
    @GetMapping
    public ResponseEntity<ApiResponse<NurseryResponse>> getNursery() {
        NurseryResponse response = nurseryService.getNursery();
        return ResponseEntity.ok(ApiResponse.success(response, "Nursery retrieved successfully."));
    }

    /**
     * GET /nursery/all - Public: search and list all nearby/registered nurseries
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<java.util.List<NurseryResponse>>> getAllNurseries(
            @RequestParam(required = false) String search) {
        java.util.List<NurseryResponse> list = nurseryService.getAllNurseries(search);
        return ResponseEntity.ok(ApiResponse.success(list, "Nurseries retrieved successfully."));
    }

    /**
     * GET /nursery/{id} - Public: get details of a specific nursery by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NurseryResponse>> getNurseryById(
            @PathVariable java.util.UUID id) {
        NurseryResponse response = nurseryService.getNurseryById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Nursery details retrieved successfully."));
    }

    /**
     * GET /nursery/profile - Authenticated profile endpoint
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<NurseryResponse>> getNurseryProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        NurseryResponse response = nurseryService.getNurseryProfileForUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "Nursery profile retrieved successfully."));
    }

    /**
     * POST /nursery - ROLE_NURSERY_OWNER: set up the nursery
     */
    @PostMapping
    public ResponseEntity<ApiResponse<NurseryResponse>> createNursery(
            @Valid @RequestBody NurseryRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        NurseryResponse response = nurseryService.createNursery(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Nursery created successfully."));
    }

    /**
     * PUT /nursery - ROLE_NURSERY_OWNER: update nursery details
     */
    @PutMapping
    public ResponseEntity<ApiResponse<NurseryResponse>> updateNursery(
            @Valid @RequestBody NurseryRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        NurseryResponse response = nurseryService.updateNursery(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "Nursery updated successfully."));
    }
}
