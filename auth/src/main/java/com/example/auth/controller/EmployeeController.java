package com.example.auth.controller;

import com.example.auth.constants.HeaderConstants;
import com.example.auth.model.enums.ServiceEnum;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.service.AuthorizationService;
import com.example.auth.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;
    private final AuthorizationService authorizationService;

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void removeEmployee(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String serviceSecret,
            @PathVariable Long id
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.authorizationService.hasInternalAccess(serviceSecret, service, ServiceEnum.RESTAURANT);

        this.employeeService.removeEmployee(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.OK)
    public List<UserDetailsResponse> getEmployees(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String serviceSecret,
            @RequestBody List<Long> userIds
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.authorizationService.hasInternalAccess(serviceSecret, service, ServiceEnum.RESTAURANT);

        return this.employeeService.getEmployees(userIds);
    }
}
