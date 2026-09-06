package com.example.auth.service;

import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.response.UserDetailsResponse;

import java.util.List;

public interface EmployeeService {
    void removeEmployee(Long id);
    List<UserDetailsResponse> getEmployees(List<Long> userIds, String email, String name, String phoneNumber, List<RoleEnum> roles, String sort);
}
