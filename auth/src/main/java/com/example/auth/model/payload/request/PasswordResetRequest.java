package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import jakarta.validation.constraints.Email;

public record PasswordResetRequest(
        @Email(message = MessageConstants.INVALID_EMAIL)
        String email
) {
}
