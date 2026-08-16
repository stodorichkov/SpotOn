package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RegexConstants;
import jakarta.validation.constraints.Pattern;

public record ChangeUsernameRequest(
        @Pattern(regexp = RegexConstants.USERNAME_REGEX, message = MessageConstants.INVALID_USERNAME)
        String newUsername
) {
}