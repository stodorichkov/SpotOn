package com.example.auth.service;

import com.example.auth.model.payload.request.LoginRequest;

public interface AuthenticationService {
    String login(LoginRequest request);
    void logout(String jti, long expirationMs);
}
