package com.example.restaurant.service;

import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.enums.ServiceEnum;

public interface AuthorizationService {
    void hasRole(RoleEnum userRoleHeader, RoleEnum... requiredRoles);
    void hasInternalAccess(String secret, ServiceEnum service, ServiceEnum... allowedServices);
}
