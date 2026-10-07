package com.gogreen.api.service;

import com.gogreen.api.dto.request.ForgotPasswordRequest;
import com.gogreen.api.dto.request.LoginRequest;
import com.gogreen.api.dto.request.NurseryRegisterRequest;
import com.gogreen.api.dto.request.RegisterRequest;
import com.gogreen.api.dto.request.ResetPasswordRequest;
import com.gogreen.api.dto.response.AuthResponse;
import com.gogreen.api.dto.response.UserResponse;

public interface AuthService {

    UserResponse registerCustomer(RegisterRequest request);

    UserResponse registerNurseryOwner(NurseryRegisterRequest request);

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser(String username);

    void verifyEmail(String token);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    boolean isNurseryRegistrationAvailable();
}
