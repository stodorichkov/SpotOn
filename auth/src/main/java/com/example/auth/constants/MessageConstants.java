package com.example.auth.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageConstants {
    // Common
    public static final String BLANK_FIELD = "Field can not be blank.";
    public static final String INTERNAL_SERVER_ERROR = "Internal server error!";

    // Setup
    public static final String ADD_ROLE = "Add role: ";
    public static final String ADD_ADMIN = "Add admin";

    // Registration
    public static final String INVALID_USERNAME = "Invalid format for username. Must be at least 3 symbols long.";
    public static final String INVALID_NAME = "Invalid format for name. It must start with capital letter " +
            "and contain only characters.";
    public static final String INVALID_PHONE_NUMBER = "Invalid format for phone number. Only digits and a leading '+' are allowed (between 7 and 15 characters)";
    public static final String INVALID_PASSWORD = "Invalid password. Password must contain at least one uppercase " +
            "letter, number or symbol and be of minimum length 8";
    public static final String PASSWORD_MISMATCH = "Password and confirm password do not match.";
    public static final String USER_EXISTS = "A user with the given username already exists.";
    public static final String ROLE_NOT_FOUND = "Role not found";

    // Login
    public static final String INVALID_USERNAME_PASSWORD = "Invalid username or password!";

    // Authorization
    public static final String INVALID_ROLE = "User role is missing or invalid.";
    public static final String ROLE_NOT_MATCHED = "You do not have the required role.";
    public static final String ANY_ROLE_NOT_MATCHED = "You do not have any of the required roles.";
}
