package com.example.auth.service;

import com.example.auth.model.enums.RoleEnum;

public interface AuthorizationService {
    void hasRole(String userRoleHeader, RoleEnum... requiredRoles);
}
