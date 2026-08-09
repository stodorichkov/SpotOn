package com.example.booking.model.payload.request;

import com.example.booking.constants.MessageConstants;
import jakarta.validation.constraints.NotNull;

public record BookingConfirmRequest(
        @NotNull(message = MessageConstants.SELECT_TABLE)
        Long tableId
) {
}