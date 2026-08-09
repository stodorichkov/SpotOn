package com.example.restaurant.model.payload.response;

public record RestaurantContactResponse(
        Long id,
        String name,
        String address,
        String phoneNumber
) {
}
