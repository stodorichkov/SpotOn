package com.example.auth.dto;

public record BookingClientResponse(
        Long id,
        String firstName,
        String lastName,
        String phone
) {
}
