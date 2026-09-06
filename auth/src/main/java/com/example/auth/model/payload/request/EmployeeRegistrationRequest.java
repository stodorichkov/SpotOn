package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RegexConstants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record EmployeeRegistrationRequest(
        @Email(message = MessageConstants.INVALID_EMAIL)
        String email,

        @Pattern(regexp = RegexConstants.NAME_REGEX, message = MessageConstants.INVALID_NAME)
        String firstName,

        @Pattern(regexp = RegexConstants.NAME_REGEX, message = MessageConstants.INVALID_NAME)
        String lastName,

        @Pattern(regexp = RegexConstants.PHONE_NUMBER_REGEX, message = MessageConstants.INVALID_PHONE_NUMBER)
        String phoneNumber
) {
}
