package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
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
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody AddEmployeeRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);

        this.employeeService.addEmployee(request, restaurantIdHeader);
    }

    @PostMapping("/manager")
    @ResponseStatus(HttpStatus.CREATED)
    public void addManager(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @Valid @RequestBody AddManagerRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        this.employeeService.addManager(request);
    }

    @GetMapping("/{id}/restaurant")
    @ResponseStatus(HttpStatus.OK)
    Long getRestaurantId(@PathVariable Long id) {
        return this.employeeService.getRestaurantId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    Page<UserDetailsResponse> getEmployees(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);

        return this.employeeService.getEmployees(restaurantIdHeader, pageable);
    }
}
