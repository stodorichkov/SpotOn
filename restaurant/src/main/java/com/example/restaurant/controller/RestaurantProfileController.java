package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class RestaurantProfileController {
    private final RestaurantService restaurantService;
    private final AuthorizationService authorizationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse getProfile(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER, RoleEnum.EMPLOYEE);

        return this.restaurantService.getRestaurant(restaurantIdHeader);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse editProfile(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody RestaurantRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);

        return this.restaurantService.editRestaurant(restaurantIdHeader, request);
    }

}
