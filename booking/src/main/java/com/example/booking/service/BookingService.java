package com.example.booking.service;

import com.example.booking.model.payload.request.ClientBookingRequest;

public interface BookingService {
    void addBooking(ClientBookingRequest request, Long clientId);
}
