package com.example.auth.model.payload.filter;

import com.example.auth.model.enums.RoleEnum;

import java.util.List;

public record EmployeeSearchFilter(
        String email,
        String name,
        String phoneNumber,
        List<RoleEnum> roles
) {
}
