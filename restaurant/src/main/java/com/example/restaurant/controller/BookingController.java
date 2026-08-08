package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.enums.ServiceEnum;
import com.example.restaurant.model.payload.response.BookingRestaurantResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.RestaurantService;
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

    @PostMapping("/restaurants")
    @ResponseStatus(HttpStatus.OK)
    List<BookingRestaurantResponse> getRestaurants(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String secret,
            @RequestBody List<Long> restaurantIds
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT);
        this.authorizationService.hasInternalAccess(secret, service, ServiceEnum.BOOKING);

        return this.restaurantService.getBookingRestaurants(restaurantIds);
    }
}
