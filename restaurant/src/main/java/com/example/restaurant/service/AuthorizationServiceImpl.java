package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.AccessDeniedException;
import com.example.restaurant.model.enums.RoleEnum;
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
