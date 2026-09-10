package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.AccessDeniedException;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.enums.ServiceEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AuthorizationServiceImpl implements AuthorizationService {
    @Value("${service.secret}")
    private String serviceSecret;

    @Override
    public void hasRole(RoleEnum userRoleHeader, RoleEnum... requiredRoles) {
        Arrays.stream(requiredRoles)
                .filter(role -> role.equals(userRoleHeader))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(MessageConstants.ACCESS_DENIED));
    }

    @Override
    public void hasInternalAccess(String secret, ServiceEnum service, ServiceEnum... allowedServices) {
        if (!secret.equals(this.serviceSecret)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        Arrays.stream(allowedServices)
                .filter(s -> s.equals(service))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(MessageConstants.ACCESS_DENIED));
    }
}
