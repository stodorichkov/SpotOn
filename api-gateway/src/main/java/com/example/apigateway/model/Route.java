package com.example.apigateway.model;

import org.springframework.http.HttpMethod;

import java.util.Set;

public record Route(String path, Set<HttpMethod> methods) {
}
