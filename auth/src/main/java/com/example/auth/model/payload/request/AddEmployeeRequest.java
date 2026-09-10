package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import jakarta.validation.constraints.NotNull;

public record AddEmployeeRequest(
        @NotNull(message = MessageConstants.BLANK_FIELD)
        Long userId
) {
}
