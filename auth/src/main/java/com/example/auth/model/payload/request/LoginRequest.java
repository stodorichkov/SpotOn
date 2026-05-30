package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String username,

        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String password
) {
}
