package com.example.restaurant.service;

import com.example.restaurant.model.enums.RoleEnum;

public interface AuthorizationService {
    void hasRole(RoleEnum userRoleHeader, RoleEnum... requiredRoles);
}
