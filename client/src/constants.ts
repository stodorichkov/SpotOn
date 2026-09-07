export const RegexConstants = {
    PASSWORD_REGEX: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,50}$/,
    NAME_REGEX: /^[A-Z][a-z]{2,29}$/,
    PHONE_NUMBER_REGEX: /^\+?[0-9]{7,15}$/,
};

export const MessageConstants = {
    BLANK_FIELD: "Field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_NAME: "3-30 letters. Must start with a capital letter.",
    INVALID_PHONE_NUMBER: "7-15 digits. May start with +.",
    INVALID_PASSWORD: "8-50 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.",
    PASSWORD_MISMATCH: "Passwords do not match.",
    NEW_PASSWORD_MATCHES_CURRENT: "New password cannot be the same as the current one.",
    TABLE_MIN_CAPACITY: "Capacity must be at least 1.",
};

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED'
}