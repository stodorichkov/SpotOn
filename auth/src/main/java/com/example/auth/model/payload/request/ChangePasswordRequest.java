package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RegexConstants;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangePasswordRequest(
        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String currentPassword,

        @Pattern(regexp = RegexConstants.PASSWORD_REGEX, message = MessageConstants.INVALID_PASSWORD)
        String newPassword,

        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String confirm
) {
    @AssertTrue(message = MessageConstants.PASSWORD_MISMATCH)
    public boolean isConfirm() {
        return newPassword.equals(confirm);
    }

    @AssertTrue(message = MessageConstants.NEW_PASSWORD_MATCHES_CURRENT)
    public boolean isNewPassword() {
        return !newPassword.equals(currentPassword);
    }
}
