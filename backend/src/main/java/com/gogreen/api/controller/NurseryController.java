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
     * GET /nursery - Public: get the nursery info
     */
    @GetMapping
    public ResponseEntity<ApiResponse<NurseryResponse>> getNursery() {
        NurseryResponse response = nurseryService.getNursery();
        return ResponseEntity.ok(ApiResponse.success(response, "Nursery retrieved successfully."));
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
