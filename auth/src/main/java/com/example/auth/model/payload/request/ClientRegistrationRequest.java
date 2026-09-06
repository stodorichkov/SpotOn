package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RegexConstants;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ClientRegistrationRequest(
        @Email(message = MessageConstants.INVALID_EMAIL)
        String email,

        @Pattern(regexp = RegexConstants.NAME_REGEX, message = MessageConstants.INVALID_NAME)
        String firstName,

        @Pattern(regexp = RegexConstants.NAME_REGEX, message = MessageConstants.INVALID_NAME)
        String lastName,

        @Pattern(regexp = RegexConstants.PHONE_NUMBER_REGEX, message = MessageConstants.INVALID_PHONE_NUMBER)
        String phoneNumber,

        @Pattern(regexp = RegexConstants.PASSWORD_REGEX, message = MessageConstants.INVALID_PASSWORD)
        String password,

        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String confirm
) {
    @AssertTrue(message = MessageConstants.PASSWORD_MISMATCH)
    public boolean isPasswordMatch() {
        return password().equals(confirm());
    }
}
