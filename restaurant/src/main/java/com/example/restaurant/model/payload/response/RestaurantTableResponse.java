package com.example.restaurant.model.payload.response;

public record RestaurantTableResponse(
        Long id,
        String name,
        Integer capacity,
        Boolean isSmokingAllowed
) {
}
