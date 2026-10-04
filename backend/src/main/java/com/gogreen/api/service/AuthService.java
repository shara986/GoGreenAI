package com.gogreen.api.service;

import com.gogreen.api.dto.request.LoginRequest;
import com.gogreen.api.dto.request.NurseryRegisterRequest;
import com.gogreen.api.dto.request.RegisterRequest;
import com.gogreen.api.dto.response.AuthResponse;
import com.gogreen.api.dto.response.UserResponse;

public interface AuthService {

    AuthResponse registerCustomer(RegisterRequest request);

    AuthResponse registerNurseryOwner(NurseryRegisterRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser(String username);
}
