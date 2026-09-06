package com.example.auth.service;

import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.response.ClientContactResponse;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    Page<UserResponse> getUsers(String email, List<RoleEnum> roles, Pageable pageable);
    UserDetailsResponse getUser(Long id);
    List<ClientContactResponse> getClientContacts(List<Long> userIds);
}
