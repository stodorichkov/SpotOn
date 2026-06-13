package com.example.booking.model.payload.request;

import com.example.booking.constants.MessageConstants;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;


public record ClientBookingRequest(
        @NotNull(message = MessageConstants.BLANK_FIELD)
        Long restaurantId,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        @Min(value = 1, message = MessageConstants.MIN_GUEST_COUNT)
        Integer guestCount,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        Boolean isSmoking,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        @Future(message = "Резервацията трябва да бъде за бъдещ момент")
        Instant dateTime
) {
}
