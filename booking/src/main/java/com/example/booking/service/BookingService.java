package com.example.booking.service;

import com.example.booking.model.payload.request.ClientBookingRequest;
import com.example.booking.model.payload.response.ClientBookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    void addBooking(ClientBookingRequest request, Long clientId);

    Page<ClientBookingResponse> getClientBookings(Long clientId, Pageable pageable);
}