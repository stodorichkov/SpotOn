package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import jakarta.validation.constraints.Email;

public record ChangeEmailRequest(
        @Email(message = MessageConstants.INVALID_EMAIL)
        String newEmail
) {
}
