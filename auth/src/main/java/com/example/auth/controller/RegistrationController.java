package com.example.auth.controller;

import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/register")
public class RegistrationController {
    private final RegistrationService registrationService;

    @PostMapping("/client")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerClient(@Valid @RequestBody ClientRegistrationRequest request) {
        registrationService.registerClient(request);
    }
}
