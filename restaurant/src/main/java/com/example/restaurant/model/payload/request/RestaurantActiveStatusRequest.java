package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import jakarta.validation.constraints.NotNull;

public record RestaurantActiveStatusRequest(
        @NotNull(message = MessageConstants.BLANK_FIELD)
        Boolean isActive
) {
}
