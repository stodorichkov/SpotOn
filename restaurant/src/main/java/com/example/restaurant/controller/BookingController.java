package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.enums.ServiceEnum;
import com.example.restaurant.model.payload.request.RestaurantTableValidationRequest;
import com.example.restaurant.model.payload.response.RestaurantContactResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.EmployeeService;
import com.example.restaurant.service.RestaurantService;
import com.example.restaurant.service.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final RestaurantService restaurantService;
    private final AuthorizationService authorizationService;
    private final RestaurantTableService restaurantTableService;
    private final EmployeeService employeeService;

    @PostMapping("/restaurants")
    @ResponseStatus(HttpStatus.OK)
    List<RestaurantContactResponse> getRestaurantsContact(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String secret,
            @RequestBody List<Long> restaurantIds
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT);
        this.authorizationService.hasInternalAccess(secret, service, ServiceEnum.BOOKING);

        return this.restaurantService.getRestaurantsContact(restaurantIds);
    }

    @GetMapping("/restaurants/{restaurantId}/exists")
    @ResponseStatus(HttpStatus.OK)
    void restaurantExists(
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String secret,
            @PathVariable Long restaurantId
    ) {
        this.authorizationService.hasInternalAccess(secret, service, ServiceEnum.BOOKING);

        this.restaurantService.restaurantExists(restaurantId);
    }

    @GetMapping("/restaurants/search")
    @ResponseStatus(HttpStatus.OK)
    List<Long> searchRestaurantIds(
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String secret,
            @RequestParam String name
    ) {
        this.authorizationService.hasInternalAccess(secret, service, ServiceEnum.BOOKING);

        return this.restaurantService.searchRestaurantIds(name);
    }

    @PostMapping("/table/validation")
    @ResponseStatus(HttpStatus.OK)
    void validateTable(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String secret,
            @RequestBody RestaurantTableValidationRequest request
    ) {
        this.authorizationService.hasInternalAccess(secret, service, ServiceEnum.BOOKING);

        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        this.restaurantTableService.validateTable(request, restaurantIdHeader);
    }
}