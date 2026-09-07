package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String name
) {
}
