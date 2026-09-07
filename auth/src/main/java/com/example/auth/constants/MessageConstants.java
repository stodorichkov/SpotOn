package com.example.auth.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageConstants {
    public static final String INTERNAL_SERVER_ERROR = "{internal.server.error}";

    public static final String BLANK_FIELD = "{blank.field}";
    public static final String INVALID_EMAIL = "{invalid.email}";
    public static final String INVALID_NAME = "{invalid.name}";
    public static final String INVALID_PHONE_NUMBER = "{invalid.phone.number}";
    public static final String INVALID_PASSWORD = "{invalid.password}";
    public static final String PASSWORD_MISMATCH = "{password.mismatch}";
    public static final String NEW_PASSWORD_MATCHES_CURRENT = "{new.password.matches.current}";
    public static final String NEW_EMAIL_MATCHES_CURRENT = "{new.email.matches.current}";

    public static final String ADD_ADMIN = "Add admin.";
    public static final String USER_EXISTS = "{user.exists}";
    public static final String INVALID_EMAIL_PASSWORD = "{invalid.email.password}";
    public static final String ACCOUNT_DEACTIVATED = "{account.deactivated}";
    public static final String WRONG_EMAIL = "{wrong.email}";
    public static final String WRONG_PASSWORD = "{wrong.password}";
    public static final String ACCESS_DENIED = "{access.denied}";
    public static final String USER_NOT_FOUND = "{user.not.found}";
    public static final String CANNOT_DEACTIVATE_SELF = "{cannot.deactivate.self}";

    public static final String ADD_ROLE = "Add role: ";
    public static final String ROLE_NOT_FOUND = "{role.not.found}";

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

    public static final String BOOKING_STATUS_EMAIL_SUBJECT = "Your SpotOn booking at %s is now %s";
    public static final String BOOKING_STATUS_EMAIL_BODY = "Hello,\n\n" +
            "Your booking at %s for %s is now %s.\n\n" +
            "Thank you for using SpotOn.";
}
