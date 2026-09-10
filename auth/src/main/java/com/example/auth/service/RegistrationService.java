package com.example.auth.service;

import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.model.payload.request.EmployeeRegistrationRequest;
import com.example.auth.model.payload.request.ManagerRegistrationRequest;

public interface RegistrationService {
    void registerClient(ClientRegistrationRequest request);
    void registerEmployee(EmployeeRegistrationRequest request, Long restaurantId);
    void registerManager(ManagerRegistrationRequest request);
    void registerAdmin();
}
