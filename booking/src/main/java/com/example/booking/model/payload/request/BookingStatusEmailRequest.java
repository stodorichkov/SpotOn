package com.example.booking.model.payload.request;

import java.time.Instant;

public record BookingStatusEmailRequest(
        Long userId,
        String restaurantName,
        Instant dateTime,
        String status
) {
}
