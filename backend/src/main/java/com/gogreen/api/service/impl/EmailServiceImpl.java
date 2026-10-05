package com.gogreen.api.service.impl;

import com.gogreen.api.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Override
    public void sendVerificationEmail(String toEmail, String name, String verificationLink) {
        String subject = "Verify your GoGreen AI account";
        String body = "Hello " + name + ",\n\n"
                + "Please verify your email address by clicking the link below:\n\n"
                + verificationLink + "\n\n"
                + "This link expires in 24 hours.\n\n"
                + "If you did not create an account, you can ignore this email.\n\n"
                + "— GoGreen AI Team";

        sendEmail(toEmail, subject, body, "verification", verificationLink);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String name, String resetLink) {
        String subject = "Reset your GoGreen AI password";
        String body = "Hello " + name + ",\n\n"
                + "We received a request to reset your password. Click the link below:\n\n"
                + resetLink + "\n\n"
                + "This link expires in 1 hour.\n\n"
                + "If you did not request a password reset, you can ignore this email.\n\n"
                + "— GoGreen AI Team";

        sendEmail(toEmail, subject, body, "password reset", resetLink);
    }

    private void sendEmail(String toEmail, String subject, String body, String purpose, String actionLink) {
        if (!mailEnabled) {
            log.warn("Email delivery disabled (app.mail.enabled=false). {} link for {}: {}",
                    purpose, toEmail, actionLink);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("{} email sent to {}", purpose, toEmail);
        } catch (Exception ex) {
            log.error("Failed to send {} email to {}: {}", purpose, toEmail, ex.getMessage());
            throw new RuntimeException("Unable to send email at this time. Please try again later.");
        }
    }
}
