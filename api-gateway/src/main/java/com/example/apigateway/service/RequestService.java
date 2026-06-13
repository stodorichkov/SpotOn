package com.example.apigateway.service;

import org.springframework.http.server.reactive.ServerHttpRequest;

public interface RequestService {
    boolean isPublic(ServerHttpRequest request);
    String extractJwt(ServerHttpRequest request);
}
