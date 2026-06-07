package com.example.restaurant.service;

import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;
import com.example.restaurant.model.payload.response.UserDetailsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployeeService {
    void addEmployee(AddEmployeeRequest request, Long restaurantId);
    void addManager(AddManagerRequest request);
    Long getRestaurantId(Long userId);
    Page<UserDetailsResponse> getEmployees(Long restaurantId, Pageable pageable);
    void removeEmployee(Long restaurantId, Long userId);
}
