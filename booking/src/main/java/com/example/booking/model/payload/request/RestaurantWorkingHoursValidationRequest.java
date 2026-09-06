package com.example.booking.model.payload.request;

import java.time.Instant;

public record RestaurantWorkingHoursValidationRequest(
        Long restaurantId,
        Instant dateTime
) {
}
