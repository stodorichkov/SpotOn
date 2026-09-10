package com.example.restaurant.model.payload.request;

import java.time.Instant;

public record RestaurantWorkingHoursValidationRequest(
        Long restaurantId,
        Instant dateTime
) {
}
