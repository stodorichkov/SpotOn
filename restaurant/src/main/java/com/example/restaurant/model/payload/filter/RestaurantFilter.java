package com.example.restaurant.model.payload.filter;

import java.util.List;

public record RestaurantFilter(
        Long id,
        String name,
        String address,
        List<Long> categoryIds,
        Boolean isOpen
) {
}
