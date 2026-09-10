package com.example.booking.service;

import com.example.booking.model.enums.RoleEnum;

public interface AuthorizationService {
    void hasRole(RoleEnum userRoleHeader, RoleEnum... requiredRoles);
}
