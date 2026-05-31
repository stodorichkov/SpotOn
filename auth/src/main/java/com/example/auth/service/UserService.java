package com.example.auth.service;

import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserResponse> getUsers(Pageable pageable);
    UserDetailsResponse getUser(Long id);
    void deactivateEmployee(Long id);
}
