package com.example.auth.service;

import com.example.auth.dto.BookingClientResponse;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    Page<UserResponse> getUsers(Pageable pageable);
    UserDetailsResponse getUser(Long id);
    List<BookingClientResponse> getUsersForBooking(List<Long> userIds);
}
