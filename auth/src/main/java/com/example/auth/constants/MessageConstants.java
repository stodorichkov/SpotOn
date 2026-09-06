package com.example.auth.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageConstants {
    public static final String INTERNAL_SERVER_ERROR = "Internal server error!";

    public static final String BLANK_FIELD = "Field can not be blank.";
    public static final String INVALID_EMAIL = "Invalid email format.";
    public static final String INVALID_NAME = "Invalid format for name. It must start with capital letter " +
            "and contain only characters.";
    public static final String INVALID_PHONE_NUMBER = "Invalid format for phone number. Only digits and a leading " +
            "'+' are allowed (between 7 and 15 characters).";
    public static final String INVALID_PASSWORD = "Invalid password. Password must contain at least one uppercase " +
            "letter, number or symbol and be of minimum length 8.";
    public static final String PASSWORD_MISMATCH = "Password and confirm password do not match.";
    public static final String NEW_PASSWORD_MATCHES_CURRENT = "New password cannot match the current password.";
    public static final String NEW_EMAIL_MATCHES_CURRENT = "New email cannot match the current email.";

    public static final String ADD_ADMIN = "Add admin.";
    public static final String USER_EXISTS = "A user with the given email already exists.";
    public static final String INVALID_EMAIL_PASSWORD = "Invalid email or password!";
    public static final String WRONG_EMAIL = "Wrong email!";
    public static final String WRONG_PASSWORD = "Wrong password!";
    public static final String ACCESS_DENIED = "Access denied for this account!";
    public static final String USER_NOT_FOUND = "User not found";

    public static final String ADD_ROLE = "Add role: ";
    public static final String ROLE_NOT_FOUND = "Role not found";

    public static final String CREDENTIALS_EMAIL_SUBJECT = "Your SpotOn account credentials";
    public static final String CREDENTIALS_EMAIL_BODY = "Hello,\n\n" +
            "An account has been created for you.\n" +
            "Email: %s\n" +
            "Password: %s\n\n" +
            "Please log in and change your password as soon as possible.";

    public static final String PASSWORD_RESET_EMAIL_SUBJECT = "Your SpotOn password has been reset";
    public static final String PASSWORD_RESET_EMAIL_BODY = "Hello,\n\n" +
            "A password reset was requested for your account.\n" +
            "Your new password: %s\n\n" +
            "Please log in and change your password as soon as possible.";
}
