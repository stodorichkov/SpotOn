package com.example.auth.model.payload.response;

public record UserResponse(
        Long id,
        String username,
        String roleName,
        boolean active
) {
}
