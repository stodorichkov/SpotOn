package com.example.restaurant.model.payload.response;

public record CategoryResponse(
        Long id,
        String nameEn,
        String nameBg,
        Boolean isActive
) {
}
