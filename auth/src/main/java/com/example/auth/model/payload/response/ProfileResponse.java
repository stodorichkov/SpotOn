package com.example.auth.model.payload.response;

import com.example.auth.model.enums.RoleEnum;

public record ProfileResponse(
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        RoleEnum role
) {
}
