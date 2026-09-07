package com.example.restaurant.model.payload.filter;

public record CategoryFilter(
        Long id,
        String name,
        Boolean isActive
) {
}
