package com.example.restaurant.model.payload.response;

import com.example.restaurant.model.enums.CategoryEnum;

import java.util.Set;

public record RestaurantDetailsResponse(
        Long id,
        String name,
        Set<CategoryEnum> categories,
        String address,
        String phoneNumber
) {
}
