package com.example.restaurant.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageConstants {
    public static final String INTERNAL_SERVER_ERROR = "{internal.server.error}";

    public static final String BLANK_FIELD = "{blank.field}";
    public static final String INVALID_PHONE_NUMBER = "{invalid.phone.number}";
    public static final String NO_CATEGORY = "{no.category}";
    public static final String TABLE_MIN_CAPACITY = "{table.min.capacity}";

    public static final String ACCESS_DENIED = "{access.denied}";

    public static final String ADD_CATEGORY = "Add Category: ";
    public static final String CATEGORY_NOT_FOUND = "{category.not.found}";

    public static final String RESTAURANT_NOT_FOUND = "{restaurant.not.found}";

    public static final String EMPLOYEE_NOT_FOUND = "{employee.not.found}";

    public static final String TABLE_NOT_FOUND = "{table.not.found}";
    public static final String TABLE_NOT_MATCH_REQUIREMENTS = "{table.not.match.requirements}";

    public static final String INVALID_WORKING_HOURS_DAYS = "{invalid.working.hours.days}";
    public static final String INVALID_WORKING_HOURS_RANGE = "{invalid.working.hours.range}";
    public static final String WORKING_HOURS_TIME_REQUIRED = "{working.hours.time.required}";

    public static final String MIN_RESERVATION_DURATION = "{min.reservation.duration}";

    public static final String OUTSIDE_WORKING_HOURS = "{outside.working.hours}";
}
