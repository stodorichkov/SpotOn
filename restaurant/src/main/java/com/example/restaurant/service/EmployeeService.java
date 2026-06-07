package com.example.restaurant.service;

import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;

public interface EmployeeService {
    void addEmployee(AddEmployeeRequest request, Long restaurantId);
    void addManager(AddManagerRequest request);
}
