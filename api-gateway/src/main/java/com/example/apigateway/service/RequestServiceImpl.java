package com.example.apigateway.service;

import com.example.apigateway.constants.PathConstants;
import com.example.apigateway.exception.UnauthorizedException;
import org.apache.hc.client5.http.auth.StandardAuthScheme;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RequestServiceImpl implements RequestService {
    @Override
    public boolean isPublicPath(ServerHttpRequest request) {
        final var requestPath = request.getURI().getPath();
        final var requestMethod = request.getMethod();

        return PathConstants.PUBLIC_PATHS.stream()
                .anyMatch(route ->
                        route.path().equals(requestPath) && route.methods().contains(requestMethod)
                );
    }

    @Override
    public String extractJwt(ServerHttpRequest request) {
        return Optional.ofNullable(request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                .filter(authHeader -> authHeader.startsWith(StandardAuthScheme.BEARER))
                .map(authHeader -> authHeader.substring(StandardAuthScheme.BEARER.length() + 1))
                .orElseThrow(UnauthorizedException::new);
    }
}
