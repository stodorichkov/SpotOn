package com.example.restaurant.model.payload.response;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record WorkingHoursEntryResponse(
        DayOfWeek dayOfWeek,
        Boolean closed,
        LocalTime openTime,
        LocalTime closeTime
) {
}
