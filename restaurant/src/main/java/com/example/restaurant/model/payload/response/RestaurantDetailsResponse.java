package com.example.restaurant.model.payload.response;

import java.util.Set;

public record RestaurantDetailsResponse(
        Long id,
        String name,
        Set<CategoryResponse> categories,
        String address,
        String phoneNumber
) {
}
