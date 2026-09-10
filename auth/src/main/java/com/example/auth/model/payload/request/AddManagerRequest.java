package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import jakarta.validation.constraints.NotNull;

public record AddManagerRequest(
        @NotNull(message = MessageConstants.BLANK_FIELD)
        Long userId,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        Long restaurantId
) {
}
