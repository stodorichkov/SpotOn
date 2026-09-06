package com.example.booking.model.payload.response;

import java.time.Instant;

public record BookingClientResponse(
        Long id,
        String status,
        RestaurantContactResponse restaurant,
        Integer guestCount,
        Boolean isSmoking,
        Instant dateTime
) {
}
