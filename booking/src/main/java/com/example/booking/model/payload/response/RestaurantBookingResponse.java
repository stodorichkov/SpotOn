package com.example.booking.model.payload.response;

import java.time.Instant;

public record RestaurantBookingResponse(
        Long id,
        String status,
        BookingClientResponse client,
        Integer guestCount,
        boolean isSmoking,
        Instant dateTime
) {
}