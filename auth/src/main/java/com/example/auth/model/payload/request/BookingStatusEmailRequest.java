package com.example.auth.model.payload.request;

import java.time.Instant;

public record BookingStatusEmailRequest(
        Long userId,
        String restaurantName,
        Instant dateTime,
        String status
) {
}
