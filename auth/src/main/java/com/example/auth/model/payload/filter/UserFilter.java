package com.example.auth.model.payload.filter;

import com.example.auth.model.enums.RoleEnum;

import java.util.List;

public record UserFilter(
        Long id,
        String email,
        List<RoleEnum> roles
) {
}
