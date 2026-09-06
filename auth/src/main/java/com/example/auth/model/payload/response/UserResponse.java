package com.example.auth.model.payload.response;

import com.example.auth.model.enums.RoleEnum;

public record UserResponse(
        Long id,
        String email,
        RoleEnum role
) {
}
