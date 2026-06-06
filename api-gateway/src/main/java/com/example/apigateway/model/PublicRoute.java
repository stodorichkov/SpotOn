package com.example.apigateway.model;

import org.springframework.http.HttpMethod;

import java.util.Set;

public record PublicRoute(String path, Set<HttpMethod> methods) {
}
