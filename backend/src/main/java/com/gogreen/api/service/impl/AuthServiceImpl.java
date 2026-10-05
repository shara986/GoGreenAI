package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.ForgotPasswordRequest;
import com.gogreen.api.dto.request.LoginRequest;
import com.gogreen.api.dto.request.NurseryRegisterRequest;
import com.gogreen.api.dto.request.RegisterRequest;
import com.gogreen.api.dto.request.ResetPasswordRequest;
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
import com.gogreen.api.service.EmailService;
import com.gogreen.api.util.TokenUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private static final int VERIFICATION_EXPIRY_HOURS = 24;
    private static final int RESET_EXPIRY_HOURS = 1;

    private final UserRepository userRepository;
    private final NurseryRepository nurseryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    @Transactional
    public UserResponse registerCustomer(RegisterRequest request) {
        validateRegistrationCredentials(request.getPassword(), request.getConfirmPassword(),
                request.getUsername(), request.getEmail());

        User user = buildPendingUser(request.getName(), request.getUsername(), request.getEmail(),
                request.getPassword(), request.getPhoneNumber(), Role.ROLE_CUSTOMER);

        user = userRepository.save(user);
        sendVerificationEmail(user);
        log.info("New Customer registered (pending verification): {}", user.getUsername());

        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse registerNurseryOwner(NurseryRegisterRequest request) {
        validateRegistrationCredentials(request.getPassword(), request.getConfirmPassword(),
                request.getUsername(), request.getEmail());

        User user = buildPendingUser(request.getName(), request.getUsername(), request.getEmail(),
                request.getPassword(), request.getPhoneNumber(), Role.ROLE_NURSERY_OWNER);

        user = userRepository.save(user);

        // If a nursery already exists, the new owner joins the existing nursery.
        // If no nursery exists yet (first owner), create one from the registration form.
        if (nurseryRepository.count() == 0) {
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
            log.info("New Nursery Owner registered (pending verification): {} — created Nursery: {}", user.getUsername(), nursery.getName());
        } else {
            log.info("New Nursery Owner registered (pending verification): {} — joined existing nursery", user.getUsername());
        }

        sendVerificationEmail(user);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        return registerCustomer(request);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        if (Boolean.FALSE.equals(user.getEmailVerified())) {
            throw new DisabledException("Please verify your email address before logging in.");
        }

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

    @Override
    @Transactional
    public void verifyEmail(String token) {
        if (!StringUtils.hasText(token)) {
            throw new BusinessRuleException("Invalid verification link.");
        }

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BusinessRuleException("Invalid or expired verification link."));

        if (user.getVerificationTokenExpiry() == null || user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Verification link has expired. Please register again or contact support.");
        }

        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
        log.info("Email verified for user: {}", user.getUsername());
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = TokenUtils.generateSecureToken();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(RESET_EXPIRY_HOURS));
            userRepository.save(user);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetLink);
            log.info("Password reset requested for user: {}", user.getUsername());
        });
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessRuleException("Password and confirm password do not match.");
        }

        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BusinessRuleException("Invalid or expired reset link."));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Reset link has expired. Please request a new password reset.");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        log.info("Password reset completed for user: {}", user.getUsername());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isNurseryRegistrationAvailable() {
        // Multiple nursery owners are allowed; registration is always available
        return true;
    }

    private void validateRegistrationCredentials(String password, String confirmPassword,
                                                 String username, String email) {
        if (!password.equals(confirmPassword)) {
            throw new BusinessRuleException("Password and confirm password do not match.");
        }
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username '" + username + "' is already taken.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email '" + email + "' is already registered.");
        }
    }

    private User buildPendingUser(String name, String username, String email,
                                  String password, String phoneNumber, Role role) {
        String verificationToken = TokenUtils.generateSecureToken();
        return User.builder()
                .name(name)
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .phoneNumber(phoneNumber)
                .role(role)
                .enabled(false)
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(LocalDateTime.now().plusHours(48))
                .build();
    }

    private void sendVerificationEmail(User user) {
        String verificationLink = frontendUrl + "/verify-email?token=" + user.getVerificationToken();
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationLink);
    }
}
