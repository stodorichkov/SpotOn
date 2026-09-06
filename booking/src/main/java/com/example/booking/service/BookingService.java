package com.example.booking.service;

import com.example.booking.model.enums.RoleEnum;
import com.example.booking.model.enums.StatuEnum;
import com.example.booking.model.payload.request.BookingClientRequest;
import com.example.booking.model.payload.request.BookingConfirmRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {
    BookingClientResponse addBooking(BookingClientRequest request, Long clientId);

    Page<BookingClientResponse> getClientBookings(Long clientId, List<StatuEnum> statuses, String restaurantName, LocalDate from, LocalDate to, Pageable pageable);
    Page<BookingEmployeeResponse> getRestaurantBookings(Long restaurantId, List<StatuEnum> statuses, String clientName, LocalDate from, LocalDate to, Pageable pageable);

    void markBookingAsConfirmed(Long bookingId, Long restaurantId, BookingConfirmRequest request);
    void markBookingAsArrived(Long bookingId, Long restaurantId);
    void markBookingAsCompleted(Long bookingId, Long restaurantId);
    void markBookingAsCanceled(Long bookingId, RoleEnum role, Long id);
}