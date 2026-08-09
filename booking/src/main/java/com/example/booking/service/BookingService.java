package com.example.booking.service;

import com.example.booking.model.payload.request.ClientBookingRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    void addBooking(ClientBookingRequest request, Long clientId);

    Page<BookingClientResponse> getClientBookings(Long clientId, Pageable pageable);

    Page<BookingEmployeeResponse> getRestaurantBookings(Long restaurantId, Pageable pageable);
}