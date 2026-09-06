package com.example.auth.service;

public interface EmailService {
    void sendCredentialsEmail(String to, String password);
    void sendPasswordResetEmail(String to, String newPassword);
}
