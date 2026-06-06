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
    public void hasRole(RoleEnum userRoleHeader, RoleEnum... requiredRoles) {
        Arrays.stream(requiredRoles)
                .filter(role -> role.equals(userRoleHeader))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(MessageConstants.ACCESS_DENIED));
    }
}
