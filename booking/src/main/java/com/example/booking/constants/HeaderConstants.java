package com.example.booking.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class HeaderConstants {
    public static final String USER_ID = "X-User-Id";
    public static final String USER_ROLE = "X-User-Role";
    public static final String RESTAURANT_ID = "X-Restaurant-Id";
    public static final String ITERNAL_SERVICE = "X-Internal-Service";
    public static final String ITERNAL_SECRET = "X-Internal-Service";
}
