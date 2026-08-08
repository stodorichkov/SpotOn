package com.example.booking.model.payload.response;

import java.time.Instant;

public record ClientBookingResponse(
        Long id,
        String status,
        BookingRestaurantResponse restaurant,
        Integer guestCount,
        boolean isSmoking,
        Instant dateTime
) {
}
