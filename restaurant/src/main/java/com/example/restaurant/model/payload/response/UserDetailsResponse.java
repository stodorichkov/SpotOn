package com.example.restaurant.model.payload.response;

import com.example.restaurant.model.enums.RoleEnum;

public record UserDetailsResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        RoleEnum role
) {
}
