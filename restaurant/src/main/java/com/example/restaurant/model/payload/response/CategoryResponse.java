package com.example.restaurant.model.payload.response;

public record CategoryResponse(
        Long id,
        String name,
        Boolean isActive
) {
}
