package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final AuthorizationService authorizationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addRestaurant(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @Valid @RequestBody RestaurantRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        this.restaurantService.addRestaurant(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<RestaurantResponse> getRestaurants(Pageable pageable) {
        return this.restaurantService.getRestaurants(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse getRestaurant(@PathVariable Long id) {
        return this.restaurantService.getRestaurant(id);
    }
}
