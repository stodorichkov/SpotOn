package com.example.booking.service;

import com.example.booking.model.payload.request.BookingClientRequest;
import com.example.booking.model.payload.request.BookingConfirmRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    void addBooking(BookingClientRequest request, Long clientId);

    Page<BookingClientResponse> getClientBookings(Long clientId, Pageable pageable);
    Page<BookingEmployeeResponse> getRestaurantBookings(Long restaurantId, Pageable pageable);

    void confirmBooking(Long bookingId, Long restaurantId, BookingConfirmRequest request);
}