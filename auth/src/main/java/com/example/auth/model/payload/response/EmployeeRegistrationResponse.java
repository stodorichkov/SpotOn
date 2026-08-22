package com.example.auth.model.payload.response;

import com.example.auth.model.enums.RoleEnum;

public record EmployeeRegistrationResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String phoneNumber,
        RoleEnum role,
        String password
) {
}
