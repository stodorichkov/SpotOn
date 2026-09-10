package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.request.RestaurantReservationDurationRequest;
import com.example.restaurant.model.payload.request.RestaurantStatusRequest;
import com.example.restaurant.model.payload.request.RestaurantWorkingHoursRequest;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.EmployeeService;
import com.example.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class RestaurantProfileController {
    private final RestaurantService restaurantService;
    private final EmployeeService employeeService;
    private final AuthorizationService authorizationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse getProfile(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER, RoleEnum.EMPLOYEE);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantService.getRestaurant(restaurantIdHeader);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse editProfile(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody RestaurantRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantService.editRestaurant(restaurantIdHeader, request);
    }

    @PatchMapping("/status")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse updateStatus(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody RestaurantStatusRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantService.updateRestaurantStatus(restaurantIdHeader, request);
    }

    @PutMapping("/working-hours")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse updateWorkingHours(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody RestaurantWorkingHoursRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantService.updateWorkingHours(restaurantIdHeader, request);
    }

    @PatchMapping("/reservation-duration")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse updateReservationDuration(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @Valid @RequestBody RestaurantReservationDurationRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantService.updateReservationDuration(restaurantIdHeader, request);
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse uploadImage(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @RequestParam("file") MultipartFile file
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantService.uploadRestaurantImage(restaurantIdHeader, file);
    }

    @DeleteMapping("/images/{imageId}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantDetailsResponse deleteImage(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantIdHeader,
            @PathVariable Long imageId
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);
        this.employeeService.hasAccessToRestaurant(restaurantIdHeader, userIdHeader);

        return this.restaurantService.deleteRestaurantImage(restaurantIdHeader, imageId);
    }
}
