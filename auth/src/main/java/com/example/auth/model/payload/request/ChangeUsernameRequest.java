package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RegexConstants;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeUsernameRequest(
        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String currentUsername,

        @Pattern(regexp = RegexConstants.USERNAME_REGEX, message = MessageConstants.INVALID_USERNAME)
        String newUsername
) {
    @AssertTrue(message = MessageConstants.NEW_USERNAME_MATCHES_CURRENT)
    public boolean isNewUsername() {
        return !newUsername.equals(currentUsername);
    }
}
