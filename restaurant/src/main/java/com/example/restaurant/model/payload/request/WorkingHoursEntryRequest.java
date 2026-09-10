package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record WorkingHoursEntryRequest(
        @NotNull(message = MessageConstants.BLANK_FIELD)
        DayOfWeek dayOfWeek,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        Boolean closed,

        LocalTime openTime,

        LocalTime closeTime
) {
}
