package com.example.restaurant.service;

import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;
import com.example.restaurant.model.payload.response.UserDetailsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployeeService {
    void addManager(AddManagerRequest request);
    void addEmployee(AddEmployeeRequest request, Long restaurantId);
    void removeEmployee(Long restaurantId, Long employeeId);
    Page<UserDetailsResponse> getEmployees(Long restaurantId, Pageable pageable);

    Long getRestaurantId(Long userId);

    void hasAccessToRestaurant(Long restaurantId, Long employeeId);
}
