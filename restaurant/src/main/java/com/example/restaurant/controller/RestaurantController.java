package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.payload.filter.RestaurantFilter;
import com.example.restaurant.model.payload.request.RestaurantActiveStatusRequest;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.CategoryResponse;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.CategoryService;
import com.example.restaurant.service.EmployeeService;
import com.example.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final AuthorizationService authorizationService;
    private final CategoryService categoryService;

    @GetMapping("/form")
    @ResponseStatus(HttpStatus.OK)
    public List<CategoryResponse> initAddRestaurantForm(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN, RoleEnum.MANAGER);

        return this.categoryService.getAllCategories();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantResponse addRestaurant(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @Valid @RequestBody RestaurantRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.restaurantService.addRestaurant(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<RestaurantResponse> getRestaurants(RestaurantFilter filter, Pageable pageable) {
        return this.restaurantService.getRestaurants(filter, pageable);
    }

    @GetMapping("/manage")
    @ResponseStatus(HttpStatus.OK)
    public Page<RestaurantResponse> getRestaurantsForManage(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            RestaurantFilter filter,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.restaurantService.getRestaurantsForManage(filter, pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse getRestaurant(@PathVariable Long id) {
        return this.restaurantService.getRestaurant(id);
    }

    @PatchMapping("/{id}/active")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse updateRestaurantActiveStatus(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @PathVariable Long id,
            @Valid @RequestBody RestaurantActiveStatusRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.restaurantService.updateRestaurantActiveStatus(id, request);
    }
}
