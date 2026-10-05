package com.gogreen.api.service;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String name, String verificationLink);

    void sendPasswordResetEmail(String toEmail, String name, String resetLink);
}
