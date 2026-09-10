package com.example.restaurant.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RegexConstants {
    public static final String PHONE_NUMBER_REGEX = "^\\+?[0-9]{7,15}$";
}
