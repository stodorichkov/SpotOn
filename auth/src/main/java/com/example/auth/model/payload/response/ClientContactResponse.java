package com.example.auth.model.payload.response;

public record ClientContactResponse(
        Long id,
        String firstName,
        String lastName,
        String phoneNumber,
        String role
) {
}
