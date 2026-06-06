package com.example.restaurant.model.payload.response;

import com.example.restaurant.model.enums.CategoryEnum;

import java.util.Set;

public record RestaurantResponse(
        Long id,
        String name,
        Set<CategoryEnum> categories
) {
}
