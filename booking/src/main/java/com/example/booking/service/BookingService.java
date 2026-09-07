package com.example.booking.service;

import com.example.booking.model.enums.RoleEnum;
import com.example.booking.model.payload.filter.BookingFilter;
import com.example.booking.model.payload.request.BookingClientRequest;
import com.example.booking.model.payload.request.BookingConfirmRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import com.example.booking.model.payload.response.BookingStatusHistoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    BookingClientResponse addBooking(BookingClientRequest request, Long clientId);

    Page<BookingClientResponse> getClientBookings(Long clientId, BookingFilter filter, String restaurantName, Pageable pageable);
    Page<BookingEmployeeResponse> getRestaurantBookings(Long restaurantId, BookingFilter filter, String clientName, Pageable pageable);

    void markBookingAsConfirmed(Long bookingId, Long restaurantId, Long employeeId, BookingConfirmRequest request);
    void markBookingAsArrived(Long bookingId, Long restaurantId, Long employeeId);
    void markBookingAsCompleted(Long bookingId, Long restaurantId, Long employeeId);
    void markBookingAsCanceled(Long bookingId, RoleEnum role, Long id, Long actorUserId);

    List<BookingStatusHistoryResponse> getBookingStatusHistory(Long bookingId, RoleEnum role, Long restaurantId);
}