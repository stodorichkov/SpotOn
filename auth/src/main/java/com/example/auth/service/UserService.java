package com.example.auth.service;

import com.example.auth.model.payload.filter.UserFilter;
import com.example.auth.model.payload.request.BookingStatusEmailRequest;
import com.example.auth.model.payload.request.UserActiveStatusRequest;
import com.example.auth.model.payload.response.ClientContactResponse;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    Page<UserResponse> getUsers(UserFilter filter, Pageable pageable);
    UserDetailsResponse getUser(Long id);
    UserDetailsResponse updateUserActiveStatus(Long id, UserActiveStatusRequest request, Long requesterId);
    List<ClientContactResponse> getClientContacts(List<Long> userIds);
    List<Long> searchClientIds(String name);
    void sendBookingStatusEmail(BookingStatusEmailRequest request);
}
