package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.payload.request.RestaurantTableRequest;
import com.example.restaurant.model.payload.response.RestaurantTableResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.EmployeeService;
import com.example.restaurant.service.RestaurantTableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tables")
@RequiredArgsConstructor
public class RestaurantTableController {
    private final RestaurantTableService restaurantTableService;
    private final AuthorizationService authorizationService;
    private final EmployeeService employeeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addTable(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody RestaurantTableRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        this.restaurantTableService.addTable(request, restaurantIdHeader);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<RestaurantTableResponse> getTables(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantTableService.getTables(restaurantIdHeader, pageable);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantTableResponse editTable(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @PathVariable Long id,
            @Valid @RequestBody RestaurantTableRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantTableService.editTable(id, restaurantIdHeader, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTable(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @PathVariable Long id
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        this.restaurantTableService.removeTable(id, restaurantIdHeader);
    }
}
