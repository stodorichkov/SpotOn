package com.example.restaurant.model.payload.filter;

public record TableFilter(
        Long id,
        String name,
        Boolean isSmokingAllowed,
        Integer minCapacity,
        Integer maxCapacity
) {
}
