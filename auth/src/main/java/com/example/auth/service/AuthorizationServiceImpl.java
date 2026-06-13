package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.exception.AccessDeniedException;
import com.example.auth.model.enums.ServiceEnum;
import com.example.auth.model.enums.RoleEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AuthorizationServiceImpl implements AuthorizationService {
    @Value("${microservice.secret}")
    private String microserviceSecret;

    @Override
    public void hasRole(RoleEnum userRoleHeader, RoleEnum... requiredRoles) {
        Arrays.stream(requiredRoles)
                .filter(role -> role.equals(userRoleHeader))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(MessageConstants.ACCESS_DENIED));
    }

    @Override
    public void hasInternalAccess(String secret, ServiceEnum service, ServiceEnum... allowedServices) {
        if (!secret.equals(this.microserviceSecret)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        Arrays.stream(allowedServices)
                .filter(s -> s.equals(service))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(MessageConstants.ACCESS_DENIED));
    }
}
