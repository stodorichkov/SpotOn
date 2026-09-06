package com.example.restaurant.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageConstants {
    public static final String INTERNAL_SERVER_ERROR = "Internal server error!";

    public static final String BLANK_FIELD = "Field can not be blank.";
    public static final String INVALID_PHONE_NUMBER = "Invalid format for phone number. Only digits and a leading " +
            "'+' are allowed (between 7 and 15 characters).";
    public static final String NO_CATEGORY = "The restaurant must have at least one category.";
    public static final String TABLE_MIN_CAPACITY = "The minimum table capacity is 1 seat.";

    public static final String ACCESS_DENIED = "Access denied for this account!";

    public static final String ADD_CATEGORY = "Add Category: ";
    public static final String CATEGORY_NOT_FOUND = "Category not found";

    public static final String RESTAURANT_NOT_FOUND = "Restaurant not found";

    public static final String EMPLOYEE_NOT_FOUND = "Employee not found";

    public static final String TABLE_NOT_FOUND = "Table not found";
    public static final String TABLE_NOT_MATCH_REQUIREMENTS = "Selected table does not match the guest's requirements.";

    public static final String INVALID_WORKING_HOURS_DAYS = "Working hours must be provided for all 7 days of the week, with no duplicates.";
    public static final String INVALID_WORKING_HOURS_RANGE = "Opening time must be before closing time.";
    public static final String WORKING_HOURS_TIME_REQUIRED = "Opening and closing time are required for a day the restaurant is open.";
}
