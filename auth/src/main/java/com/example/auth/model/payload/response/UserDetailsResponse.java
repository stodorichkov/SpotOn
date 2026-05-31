package com.example.auth.model.payload.response;

public record UserDetailsResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String phoneNumber,
        String roleName
) {
}
