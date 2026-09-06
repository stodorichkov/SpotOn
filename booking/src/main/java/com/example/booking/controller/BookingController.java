package com.example.booking.controller;

import com.example.booking.constants.HeaderConstants;
import com.example.booking.model.enums.RoleEnum;
import com.example.booking.model.enums.StatuEnum;
import com.example.booking.model.payload.request.BookingClientRequest;
import com.example.booking.model.payload.request.BookingConfirmRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import com.example.booking.service.AuthorizationService;
import com.example.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final AuthorizationService authorizationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingClientResponse addBooking(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @Valid @RequestBody BookingClientRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT);

        return this.bookingService.addBooking(request, userIdHeader);
    }

    @GetMapping
    public Page<BookingClientResponse> getClientBookings(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestParam(required = false) List<StatuEnum> statuses,
            @RequestParam(required = false) String restaurantName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT);

        return this.bookingService.getClientBookings(userIdHeader, statuses, restaurantName, from, to, pageable);
    }

    @GetMapping("/restaurant")
    public Page<BookingEmployeeResponse> getRestaurantBookings(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            @RequestParam(required = false) List<StatuEnum> statuses,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        return this.bookingService.getRestaurantBookings(restaurantId, statuses, clientName, from, to, pageable);
    }

    @PatchMapping("/{bookingId}/confirmed")
    public void markBookingAsConfirmed(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingConfirmRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        this.bookingService.markBookingAsConfirmed(bookingId, restaurantId, request);
    }

    @PatchMapping("/{bookingId}/arrived")
    public void markBookingAsArrived(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            @PathVariable Long bookingId
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        this.bookingService.markBookingAsArrived(bookingId, restaurantId);
    }

    @PatchMapping("/{bookingId}/completed")
    public void markBookingAsCompleted(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            @PathVariable Long bookingId
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        this.bookingService.markBookingAsCompleted(bookingId, restaurantId);
    }

    @PatchMapping("/{bookingId}/canceled")
    public void markBookingAsCanceled(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(value = HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(value = HeaderConstants.RESTAURANT_ID, required = false) Long restaurantId,
            @PathVariable Long bookingId
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT, RoleEnum.EMPLOYEE);

        if (userRoleHeader == RoleEnum.CLIENT) {
            this.bookingService.markBookingAsCanceled(bookingId, RoleEnum.CLIENT, userIdHeader);
        } else {
            this.bookingService.markBookingAsCanceled(bookingId, RoleEnum.EMPLOYEE, restaurantId);
        }
    }
}