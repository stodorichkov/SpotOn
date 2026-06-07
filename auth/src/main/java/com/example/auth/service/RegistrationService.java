package com.example.auth.service;

import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.model.payload.request.EmployeeRegistrationRequest;
import com.example.auth.model.payload.request.ManagerRegistrationRequest;
import com.example.auth.model.payload.response.EmployeeRegistrationResponse;

public interface RegistrationService {
    void registerClient(ClientRegistrationRequest request);
    EmployeeRegistrationResponse registerEmployee(EmployeeRegistrationRequest request, Long restaurantId);
    EmployeeRegistrationResponse registerManager(ManagerRegistrationRequest request);
    void registerAdmin();
}
