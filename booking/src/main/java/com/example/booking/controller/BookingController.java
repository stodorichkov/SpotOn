package com.example.booking.controller;

import com.example.booking.constants.HeaderConstants;
import com.example.booking.model.enums.RoleEnum;
import com.example.booking.model.payload.request.ClientBookingRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import com.example.booking.service.AuthorizationService;
import com.example.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final AuthorizationService authorizationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addBooking(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @Valid @RequestBody ClientBookingRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT);

        this.bookingService.addBooking(request, userIdHeader);
    }

    @GetMapping
    public Page<BookingClientResponse> getClientBookings(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT);

        return this.bookingService.getClientBookings(userIdHeader, pageable);
    }

    @GetMapping("/restaurant")
    public Page<BookingEmployeeResponse> getRestaurantBookings(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        return this.bookingService.getRestaurantBookings(restaurantId, pageable);
    }
}