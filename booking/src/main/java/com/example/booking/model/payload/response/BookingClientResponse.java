package com.example.booking.model.payload.response;

public record BookingClientResponse(
        Long id,
        String firstName,
        String lastName,
        String phone
) {
}