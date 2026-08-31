package com.example.auth.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageConstants {
    public static final String INTERNAL_SERVER_ERROR = "Internal server error!";

    public static final String BLANK_FIELD = "Field can not be blank.";
    public static final String INVALID_USERNAME = "Invalid format for username. Must be at least 3 symbols long.";
    public static final String INVALID_NAME = "Invalid format for name. It must start with capital letter " +
            "and contain only characters.";
    public static final String INVALID_PHONE_NUMBER = "Invalid format for phone number. Only digits and a leading " +
            "'+' are allowed (between 7 and 15 characters).";
    public static final String INVALID_PASSWORD = "Invalid password. Password must contain at least one uppercase " +
            "letter, number or symbol and be of minimum length 8.";
    public static final String PASSWORD_MISMATCH = "Password and confirm password do not match.";
    public static final String NEW_PASSWORD_MATCHES_CURRENT = "New password cannot match the current password.";
    public static final String NEW_USERNAME_MATCHES_CURRENT = "New username cannot match the current username.";

    public static final String ADD_ADMIN = "Add admin.";
    public static final String USER_EXISTS = "A user with the given username already exists.";
    public static final String INVALID_USERNAME_PASSWORD = "Invalid username or password!";
    public static final String WRONG_USERNAME = "Wrong username!";
    public static final String WRONG_PASSWORD = "Wrong password!";
    public static final String ACCESS_DENIED = "Access denied for this account!";
    public static final String USER_NOT_FOUND = "User not found";

    public static final String ADD_ROLE = "Add role: ";
    public static final String ROLE_NOT_FOUND = "Role not found";
}
