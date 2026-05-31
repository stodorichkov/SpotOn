package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.user.UserMapper;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import com.example.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public Page<UserResponse> getUsers(Pageable pageable) {
        return this.userRepository.findAll(pageable)
                .map(this.userMapper::mapToUserResponse);
    }

    @Override
    public UserDetailsResponse getUser(Long id) {
        return this.userRepository.findById(id)
                .map(this.userMapper::mapToUserDetailsResponse)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));
    }
}
