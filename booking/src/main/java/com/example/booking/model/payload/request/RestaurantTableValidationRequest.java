package com.example.booking.model.payload.request;

public record RestaurantTableValidationRequest(
        Long tableId,
        Integer guestCount,
        Boolean isSmoking
) {
}