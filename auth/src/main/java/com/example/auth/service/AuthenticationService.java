package com.example.auth.service;

import com.example.auth.model.payload.request.LoginRequest;
import com.example.auth.model.payload.request.PasswordResetRequest;

public interface AuthenticationService {
    String login(LoginRequest request);
    void logout(String jti, long expirationMs);
    void resetPassword(PasswordResetRequest request);
}
