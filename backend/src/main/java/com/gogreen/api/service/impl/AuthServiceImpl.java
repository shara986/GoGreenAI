package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.LoginRequest;
import com.gogreen.api.dto.request.NurseryRegisterRequest;
import com.gogreen.api.dto.request.RegisterRequest;
import com.gogreen.api.dto.response.AuthResponse;
import com.gogreen.api.dto.response.UserResponse;
import com.gogreen.api.entity.Nursery;
import com.gogreen.api.entity.Role;
import com.gogreen.api.entity.User;
import com.gogreen.api.exception.BusinessRuleException;
import com.gogreen.api.exception.DuplicateResourceException;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.mapper.UserMapper;
import com.gogreen.api.repository.NurseryRepository;
import com.gogreen.api.repository.UserRepository;
import com.gogreen.api.security.jwt.JwtTokenProvider;
import com.gogreen.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final NurseryRepository nurseryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse registerCustomer(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessRuleException("Password and confirm password do not match.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered.");
        }

        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();

        user = userRepository.save(user);
        log.info("New Customer registered: {}", user.getUsername());

        String token = jwtTokenProvider.generateToken(user);
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse registerNurseryOwner(NurseryRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessRuleException("Password and confirm password do not match.");
        }

        // Business Rule: ONLY ONE Nursery Owner in the entire GoGreen AI system
        if (userRepository.existsByRole(Role.ROLE_NURSERY_OWNER) || nurseryRepository.count() > 0) {
            throw new DuplicateResourceException("A Nursery Owner already exists.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered.");
        }

        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.ROLE_NURSERY_OWNER)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String nurseryName = StringUtils.hasText(request.getNurseryName()) ? request.getNurseryName() : request.getName() + "'s Nursery";
        String address = StringUtils.hasText(request.getAddress()) ? request.getAddress() : "Default Nursery Address";
        String city = StringUtils.hasText(request.getCity()) ? request.getCity() : "Default City";
        String contactEmail = StringUtils.hasText(request.getContactEmail()) ? request.getContactEmail() : request.getEmail();
        String contactPhone = StringUtils.hasText(request.getContactPhone()) ? request.getContactPhone() : request.getPhoneNumber();

        Nursery nursery = Nursery.builder()
                .user(user)
                .name(nurseryName)
                .description(StringUtils.hasText(request.getDescription()) ? request.getDescription() : "Official Nursery")
                .address(address)
                .city(city)
                .postalCode(request.getPostalCode())
                .contactEmail(contactEmail)
                .contactPhone(contactPhone)
                .logoUrl(request.getLogoUrl())
                .build();

        nurseryRepository.save(nursery);
        log.info("New Nursery Owner registered: {} with Nursery: {}", user.getUsername(), nursery.getName());

        String token = jwtTokenProvider.generateToken(user);
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        return registerCustomer(request);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        log.info("User logged in: {}", user.getUsername());

        String token = jwtTokenProvider.generateToken(user);
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return userMapper.toResponse(user);
    }
}
