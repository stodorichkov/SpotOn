package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.exception.AccessDeniedException;
import com.example.auth.model.enums.RoleEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AuthorizationServiceImpl implements AuthorizationService {
    @Override
    public void hasRole(String userRoleHeader, RoleEnum requiredRole) {
        Arrays.stream(RoleEnum.values())
                .filter(role -> role == requiredRole && role.name().equalsIgnoreCase(userRoleHeader.trim()))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(MessageConstants.ROLE_NOT_MATCHED));
    }

    @Override
    public void hasAnyRole(String userRoleHeader, RoleEnum... requiredRoles) {
        Arrays.stream(requiredRoles)
                .filter(role -> role.name().equalsIgnoreCase(userRoleHeader.trim()))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(MessageConstants.ANY_ROLE_NOT_MATCHED));
    }
}
