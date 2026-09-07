package com.example.restaurant.model.payload.response;

import java.util.Set;

public record RestaurantResponse(
        Long id,
        String name,
        Set<CategoryResponse> categories,
        String address,
        Boolean isOpen,
        Boolean isActive
) {
}
