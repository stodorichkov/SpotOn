package com.example.auth.service;

import com.example.auth.model.payload.request.ClientRegistrationRequest;

public interface RegistrationService {
    void registerClient(ClientRegistrationRequest request);
}
