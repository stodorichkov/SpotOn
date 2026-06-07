package com.example.apigateway.service;

import io.jsonwebtoken.Claims;

public interface JwtService {
    Claims extractAllClaims(String token);
    String extractJti(Claims claims);
    Long extractUserId(Claims claims);
    String extractRole(Claims claims);
    Long extractRestaurantId(Claims claims);
    Long extractExpiration(Claims claims);
}
