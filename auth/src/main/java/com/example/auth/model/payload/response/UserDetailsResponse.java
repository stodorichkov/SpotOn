package com.example.auth.model.payload.response;

import com.example.auth.model.enums.RoleEnum;

public record UserDetailsResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        RoleEnum role,
        Boolean isActive
) {
}
