package com.gogreen.api.controller;

import com.gogreen.api.dto.request.ForgotPasswordRequest;
import com.gogreen.api.dto.request.LoginRequest;
import com.gogreen.api.dto.request.NurseryRegisterRequest;
import com.gogreen.api.dto.request.RegisterRequest;
import com.gogreen.api.dto.request.ResetPasswordRequest;
import com.gogreen.api.dto.response.ApiResponse;
import com.gogreen.api.dto.response.AuthResponse;
import com.gogreen.api.dto.response.UserResponse;
import com.gogreen.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/customer")
    public ResponseEntity<ApiResponse<UserResponse>> registerCustomer(
            @Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response,
                        "Registration successful. Please check your email to verify your account before logging in."));
    }

    @PostMapping("/register/nursery")
    public ResponseEntity<ApiResponse<UserResponse>> registerNurseryOwner(
            @Valid @RequestBody NurseryRegisterRequest request) {
        UserResponse response = authService.registerNurseryOwner(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response,
                        "Nursery Owner registered successfully. Please check your email to verify your account before logging in."));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response,
                        "Registration successful. Please check your email to verify your account before logging in."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful."));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response, "User retrieved successfully."));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success(null, "Email verified successfully. You can now log in."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(null,
                "If an account exists for this email, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully. You can now log in."));
    }

    @GetMapping("/nursery-registration-available")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> isNurseryRegistrationAvailable() {
        boolean available = authService.isNurseryRegistrationAvailable();
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("available", available),
                available ? "Nursery registration is available." : "A Nursery Owner already exists."));
    }
}
