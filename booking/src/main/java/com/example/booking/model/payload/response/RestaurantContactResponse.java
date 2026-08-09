package com.example.booking.model.payload.response;

public record RestaurantContactResponse(
        Long id,
        String name,
        String address,
        String phoneNumber
) {
}
