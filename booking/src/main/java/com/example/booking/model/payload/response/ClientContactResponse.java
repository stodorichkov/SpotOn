package com.example.booking.model.payload.response;

public record ClientContactResponse(
        Long id,
        String firstName,
        String lastName,
        String phone
) {
}