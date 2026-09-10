package com.example.booking.controller;

import com.example.booking.constants.HeaderConstants;
import com.example.booking.model.enums.RoleEnum;
import com.example.booking.model.payload.filter.BookingFilter;
import com.example.booking.model.payload.request.BookingClientRequest;
import com.example.booking.model.payload.request.BookingConfirmRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import com.example.booking.model.payload.response.BookingStatusHistoryResponse;
import com.example.booking.service.AuthorizationService;
import com.example.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
            BookingFilter filter,
            @RequestParam(required = false) String restaurantName,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.CLIENT);

        return this.bookingService.getClientBookings(userIdHeader, filter, restaurantName, pageable);
    }

    @GetMapping("/restaurant")
    public Page<BookingEmployeeResponse> getRestaurantBookings(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(value = HeaderConstants.RESTAURANT_ID, required = false) Long restaurantIdHeader,
            @RequestParam(required = false) Long restaurantId,
            BookingFilter filter,
            @RequestParam(required = false) String clientName,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.EMPLOYEE);

        if (userRoleHeader == RoleEnum.ADMIN) {
            return Optional.ofNullable(restaurantId)
                    .map(rid -> this.bookingService.getRestaurantBookings(rid, filter, clientName, pageable))
                    .orElseGet(() -> Page.empty(pageable));
        }

        return this.bookingService.getRestaurantBookings(restaurantIdHeader, filter, clientName, pageable);
    }

    @PatchMapping("/{bookingId}/confirmed")
    public void markBookingAsConfirmed(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingConfirmRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        this.bookingService.markBookingAsConfirmed(bookingId, restaurantId, userIdHeader, request);
    }

    @PatchMapping("/{bookingId}/arrived")
    public void markBookingAsArrived(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            @PathVariable Long bookingId
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        this.bookingService.markBookingAsArrived(bookingId, restaurantId, userIdHeader);
    }

    @PatchMapping("/{bookingId}/completed")
    public void markBookingAsCompleted(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @RequestHeader(HeaderConstants.RESTAURANT_ID) Long restaurantId,
            @PathVariable Long bookingId
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);

        this.bookingService.markBookingAsCompleted(bookingId, restaurantId, userIdHeader);
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
            this.bookingService.markBookingAsCanceled(bookingId, RoleEnum.CLIENT, userIdHeader, userIdHeader);
        } else {
            this.bookingService.markBookingAsCanceled(bookingId, RoleEnum.EMPLOYEE, restaurantId, userIdHeader);
        }
    }

    @GetMapping("/{bookingId}/status-history")
    public List<BookingStatusHistoryResponse> getBookingStatusHistory(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(value = HeaderConstants.RESTAURANT_ID, required = false) Long restaurantId,
            @PathVariable Long bookingId
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN, RoleEnum.MANAGER);

        return this.bookingService.getBookingStatusHistory(bookingId, userRoleHeader, restaurantId);
    }
}