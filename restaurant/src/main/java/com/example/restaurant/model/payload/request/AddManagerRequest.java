package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import jakarta.validation.constraints.NotNull;

public record AddManagerRequest(
        @NotNull(message = MessageConstants.BLANK_FIELD)
        Long userId,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        Long restaurantId
) {
}
