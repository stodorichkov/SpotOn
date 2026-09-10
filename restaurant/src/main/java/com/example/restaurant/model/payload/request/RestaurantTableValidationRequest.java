package com.example.restaurant.model.payload.request;

public record RestaurantTableValidationRequest(
        Long tableId,
        Integer guestCount,
        Boolean isSmoking
) {
}