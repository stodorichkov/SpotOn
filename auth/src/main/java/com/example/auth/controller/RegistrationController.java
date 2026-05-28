package com.example.auth.controller;

import com.example.auth.constants.AuthorizationConstants;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.model.payload.request.StaffRegistrationRequest;
import com.example.auth.model.payload.response.StaffRegistrationResponse;
import com.example.auth.service.AuthorizationService;
import com.example.auth.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/register")
public class RegistrationController {
    private final RegistrationService registrationService;
    private final AuthorizationService authorizationService;

    @PostMapping("/client")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerClient(@Valid @RequestBody ClientRegistrationRequest request) {
        registrationService.registerClient(request);
    }

    @PostMapping("/employee")
    @ResponseStatus(HttpStatus.CREATED)
    public StaffRegistrationResponse registerEmployee(
            @RequestHeader(value = AuthorizationConstants.HEADER_USER_ROLE, required = false) String userRoleHeader,
            @Valid @RequestBody StaffRegistrationRequest request
    ) {
        authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);

        return registrationService.registerStaff(request, RoleEnum.EMPLOYEE);
    }

    @PostMapping("/manager")
    @ResponseStatus(HttpStatus.CREATED)
    public StaffRegistrationResponse registerManager(
            @RequestHeader(value = AuthorizationConstants.HEADER_USER_ROLE, required = false) String userRoleHeader,
            @Valid @RequestBody StaffRegistrationRequest request
    ) {
        authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return registrationService.registerStaff(request, RoleEnum.MANAGER);
    }
}
