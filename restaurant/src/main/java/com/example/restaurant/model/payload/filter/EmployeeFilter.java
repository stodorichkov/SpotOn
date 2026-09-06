package com.example.restaurant.model.payload.filter;

import com.example.restaurant.model.enums.RoleEnum;

import java.util.List;

public record EmployeeFilter(
        Long id,
        String email,
        String name,
        String phoneNumber,
        List<RoleEnum> roles
) {
}
