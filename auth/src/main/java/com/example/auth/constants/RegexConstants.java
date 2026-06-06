package com.example.auth.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RegexConstants {
    public static final String USERNAME_REGEX = "^[a-zA-Z0-9_.-]{3,50}$";
    public static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,50}$";
    public static final String NAME_REGEX = "^[A-Z][a-z]{2,29}$";
    public static final String PHONE_NUMBER_REGEX = "^\\+?[0-9]{7,15}$";
}
