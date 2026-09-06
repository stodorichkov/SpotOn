package com.example.booking.model.payload.response;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
        Instant timestamp,
        String message,
        Map<String, String> errors
) {
    public ErrorResponse(String message) {
        this(Instant.now(), message, null);
    }

    public ErrorResponse(Map<String, String> errors) {
        this(Instant.now(), null, errors);
    }
}
