package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RestaurantTableRequest(
        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String name,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        @Min(value = 1, message = MessageConstants.TABLE_MIN_CAPACITY)
        Integer capacity,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        Boolean isSmokingAllowed
) {
}
