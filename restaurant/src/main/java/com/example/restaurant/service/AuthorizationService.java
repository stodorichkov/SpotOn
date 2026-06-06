package com.example.restaurant.service;

import com.example.restaurant.model.enums.RoleEnum;

public interface AuthorizationService {
    void hasRole(String userRoleHeader, RoleEnum... requiredRoles);
}
