package com.example.auth.controller;

import com.example.auth.constants.HeaderConstants;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.model.payload.request.EmployeeRegistrationRequest;
import com.example.auth.model.payload.request.ManagerRegistrationRequest;
import com.example.auth.model.payload.response.EmployeeRegistrationResponse;
import com.example.auth.service.AuthorizationService;
import com.example.auth.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService registrationService;
    private final AuthorizationService authorizationService;

    @PostMapping("/client")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerClient(@Valid @RequestBody ClientRegistrationRequest request) {
        this.registrationService.registerClient(request);
    }

    @PostMapping("/employee")
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeRegistrationResponse registerEmployee(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody EmployeeRegistrationRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER, RoleEnum.ADMIN);

        return this.registrationService.registerEmployee(request, restaurantIdHeader);
    }

    @PostMapping("/manager")
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeRegistrationResponse registerManager(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @Valid @RequestBody ManagerRegistrationRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.registrationService.registerManager(request);
    }
}
