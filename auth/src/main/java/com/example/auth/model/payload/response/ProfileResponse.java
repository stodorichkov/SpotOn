package com.example.auth.model.payload.response;

public record ProfileResponse(
        String username,
        String firstName,
        String lastName,
        String phoneNumber,
        String roleName
) {
}
