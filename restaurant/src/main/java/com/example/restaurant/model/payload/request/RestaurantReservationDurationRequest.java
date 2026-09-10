package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RestaurantReservationDurationRequest(
        @NotNull(message = MessageConstants.BLANK_FIELD)
        @Min(value = 1, message = MessageConstants.MIN_RESERVATION_DURATION)
        Integer reservationDurationMinutes
) {
}
