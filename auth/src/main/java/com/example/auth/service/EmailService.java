package com.example.auth.service;

import java.time.Instant;

public interface EmailService {
    void sendCredentialsEmail(String to, String password);
    void sendPasswordResetEmail(String to, String newPassword);
    void sendBookingStatusEmail(String to, String restaurantName, Instant dateTime, String status);
}
