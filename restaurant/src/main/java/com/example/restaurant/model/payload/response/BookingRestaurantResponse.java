package com.example.restaurant.model.payload.response;

public record BookingRestaurantResponse(
        Long id,
        String name,
        String address,
        String phoneNumber
) {
}
