export const RegexConstants = {
    USERNAME_REGEX: /^[a-zA-Z0-9_.-]{3,50}$/,
    PASSWORD_REGEX: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,50}$/,
    NAME_REGEX: /^[A-Z][a-z]{2,29}$/,
    PHONE_NUMBER_REGEX: /^\+?[0-9]{7,15}$/,
};

export const MessageConstants = {
    BLANK_FIELD: "Field is required.",
    INVALID_USERNAME: "3-50 characters. Allowed are letters, numbers, _, . and -.",
    INVALID_NAME: "3-30 letters. Must start with a capital letter.",
    INVALID_PHONE_NUMBER: "7-15 digits. May start with +.",
    INVALID_PASSWORD: "8-50 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.",
    PASSWORD_MISMATCH: "Passwords do not match.",
    NEW_PASSWORD_MATCHES_CURRENT: "New password cannot be the same as the current one.",
    NO_CATEGORY: "Please select at least one category.",
};