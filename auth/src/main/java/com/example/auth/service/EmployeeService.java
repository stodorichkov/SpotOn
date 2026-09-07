package com.example.auth.service;

import com.example.auth.model.payload.filter.EmployeeSearchFilter;
import com.example.auth.model.payload.response.UserDetailsResponse;

import java.util.List;

public interface EmployeeService {
    void removeEmployee(Long id);
    List<UserDetailsResponse> getEmployees(List<Long> userIds, EmployeeSearchFilter filter, String sort);
    void invalidateSessions(List<Long> userIds);
}
