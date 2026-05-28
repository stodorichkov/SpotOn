package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RegexConstants;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ClientRegistrationRequest(
        @Pattern(regexp = RegexConstants.USER_NAME_REGEX, message = MessageConstants.INVALID_USERNAME)
        String username,

        @Pattern(regexp = RegexConstants.NAME_REGEX, message = MessageConstants.INVALID_NAME)
        String firstName,

        @Pattern(regexp = RegexConstants.USER_NAME_REGEX, message = MessageConstants.INVALID_NAME)
        String lastName,

        @Pattern(regexp = RegexConstants.PHONE_NUMBER_REGEX, message = MessageConstants.INVALID_PHONE_NUMBER)
        String phoneNumber,

        @Pattern(regexp = RegexConstants.PASSWORD_REGEX, message = MessageConstants.INVALID_PASSWORD)
        String password,

        @NotBlank(message = MessageConstants.FIELD_CANNOT_BE_BLANK)
        String confirm
) {
    @AssertTrue(message = MessageConstants.PASSWORD_MISMATCH)
    public boolean isPasswordMatch() {
        return password().equals(confirm());
    }
}
