package com.example.restaurant.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageConstants {
    // Common
    public static final String INTERNAL_SERVER_ERROR = "Internal server error!";

    // Validation
    public static final String BLANK_FIELD = "Field can not be blank.";
    public static final String INVALID_PHONE_NUMBER = "Invalid format for phone number. Only digits and a leading " +
            "'+' are allowed (between 7 and 15 characters).";
    public static final String NO_CATEGORY = "The restaurant must have at least one category.";
    public static final String TABLE_MIN_CAPACITY = "The minimum table capacity is 1 seat.";

    // User
    public static final String ACCESS_DENIED = "Access denied for this account!";

    // Category
    public static final String ADD_CATEGORY = "Add Category: ";
    public static final String CATEGORY_NOT_FOUND = "Category not found";

    // Restaurant
    public static final String RESTAURANT_NOT_FOUND = "Restaurant not found";

    // Employee
    public static final String EMPLOYEE_NOT_FOUND = "Employee not found";
}
