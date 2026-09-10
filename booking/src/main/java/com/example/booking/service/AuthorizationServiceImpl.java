package com.example.booking.service;

import com.example.booking.constants.MessageConstants;
import com.example.booking.exception.AccessDeniedException;
import com.example.booking.model.enums.RoleEnum;
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
