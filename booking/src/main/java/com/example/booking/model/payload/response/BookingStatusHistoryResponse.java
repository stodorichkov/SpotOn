package com.example.booking.model.payload.response;

import java.time.Instant;

public record BookingStatusHistoryResponse(
        Long id,
        String status,
        Instant changedAt,
        Long changedByUserId,
        String changedByFirstName,
        String changedByLastName,
        String changedByRole
) {
}
