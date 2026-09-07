package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromEmail;

    @Override
    public void sendCredentialsEmail(String to, String password) {
        final var message = new SimpleMailMessage();
        message.setFrom(this.fromEmail);
        message.setTo(to);
        message.setSubject(MessageConstants.CREDENTIALS_EMAIL_SUBJECT);
        message.setText(MessageConstants.CREDENTIALS_EMAIL_BODY.formatted(to, password));

        this.mailSender.send(message);
    }

    @Override
    public void sendPasswordResetEmail(String to, String newPassword) {
        final var message = new SimpleMailMessage();
        message.setFrom(this.fromEmail);
        message.setTo(to);
        message.setSubject(MessageConstants.PASSWORD_RESET_EMAIL_SUBJECT);
        message.setText(MessageConstants.PASSWORD_RESET_EMAIL_BODY.formatted(newPassword));

        this.mailSender.send(message);
    }
}
