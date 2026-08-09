package com.example.booking.model.payload.response;

import java.time.Instant;

public record BookingEmployeeResponse(
        Long id,
        String status,
        ClientContactResponse client,
        Integer guestCount,
        boolean isSmoking,
        Instant dateTime
) {
}