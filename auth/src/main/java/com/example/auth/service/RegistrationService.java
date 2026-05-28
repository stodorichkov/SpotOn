package com.example.auth.service;

import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.model.payload.request.StaffRegistrationRequest;
import com.example.auth.model.payload.response.StaffRegistrationResponse;

public interface RegistrationService {
    void registerClient(ClientRegistrationRequest request);
    StaffRegistrationResponse registerStaff(StaffRegistrationRequest request, RoleEnum roleName);
    void registerAdmin();
}
