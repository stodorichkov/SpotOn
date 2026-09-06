package com.example.auth.controller;

import com.example.auth.constants.HeaderConstants;
import com.example.auth.model.payload.request.LoginRequest;
import com.example.auth.model.payload.request.PasswordResetRequest;
import com.example.auth.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public String login(@Valid @RequestBody LoginRequest request) {
        return this.authenticationService.login(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(
            @RequestHeader(HeaderConstants.USER_JTI) String jti,
            @RequestHeader(HeaderConstants.USER_EXPIRATION) Long expirationMs
    ) {
        this.authenticationService.logout(jti, expirationMs);
    }

    @PostMapping("/password-reset")
    @ResponseStatus(HttpStatus.OK)
    public void resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        this.authenticationService.resetPassword(request);
    }
}
