package com.example.restaurant.model.payload.request;

public record RestaurantTableValidationRequest(
        Long tableId,
        Integer guestCount,
        boolean isSmoking
) {
}