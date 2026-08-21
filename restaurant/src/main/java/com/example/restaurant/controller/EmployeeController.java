package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.enums.ServiceEnum;
import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;
import com.example.restaurant.model.payload.response.UserDetailsResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;
    private final AuthorizationService authorizationService;

    @PostMapping("/employee")
    @ResponseStatus(HttpStatus.CREATED)
    public void addEmployee(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String serviceSecret,
            @Valid @RequestBody AddEmployeeRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.authorizationService.hasInternalAccess(serviceSecret, service, ServiceEnum.AUTH);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        this.employeeService.addEmployee(request, restaurantIdHeader);
    }

    @PostMapping("/manager")
    @ResponseStatus(HttpStatus.CREATED)
    public void addManager(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String serviceSecret,
            @Valid @RequestBody AddManagerRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);
        this.authorizationService.hasInternalAccess(serviceSecret, service, ServiceEnum.AUTH);

        this.employeeService.addManager(request);
    }

    @GetMapping("/{id}/restaurant")
    @ResponseStatus(HttpStatus.OK)
    Long getRestaurantId(
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String serviceSecret,
            @PathVariable Long id
    ) {
        this.authorizationService.hasInternalAccess(serviceSecret, service, ServiceEnum.AUTH);

        return this.employeeService.getRestaurantId(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    Page<UserDetailsResponse> getEmployees(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(value = HeaderConstants.RESTAURANT_ID, required = false) Long restaurantIdHeader,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN, RoleEnum.MANAGER);

        if (userRoleHeader == RoleEnum.MANAGER) {
            this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

            return this.employeeService.getEmployees(restaurantIdHeader, pageable);
        } else {
            return this.employeeService.getEmployees(pageable);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    void removeEmployee(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(value = HeaderConstants.RESTAURANT_ID, required = false) Long restaurantIdHeader,
            @PathVariable Long id
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN, RoleEnum.MANAGER);

        if (userRoleHeader == RoleEnum.MANAGER) {
            this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);
            this.employeeService.removeEmployee(restaurantIdHeader, id);
        } else {
            this.employeeService.removeEmployee(id);
        }
    }
}