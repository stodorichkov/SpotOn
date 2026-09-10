package com.example.auth.service;

import com.example.auth.model.enums.ServiceEnum;
import com.example.auth.model.enums.RoleEnum;

public interface AuthorizationService {
    void hasRole(RoleEnum userRoleHeader, RoleEnum... requiredRoles);
    void hasInternalAccess(String secret, ServiceEnum service, ServiceEnum... allowedServices);
}
