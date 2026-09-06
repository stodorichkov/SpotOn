package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.response.ClientContactResponse;
import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.UserMapper;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import com.example.auth.repository.UserRepository;
import com.example.auth.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public Page<UserResponse> getUsers(String email, List<RoleEnum> roles, Pageable pageable) {
        Specification<User> specification = Specification.unrestricted();

        if (StringUtils.hasText(email)) {
            specification = specification.and(UserSpecification.hasEmailContaining(email));
        }

        if (roles != null && !roles.isEmpty()) {
            specification = specification.and(UserSpecification.hasRoles(roles));
        }

        return this.userRepository.findAll(specification, pageable)
                .map(this.userMapper::mapToUserResponse);
    }

    @Override
    public UserDetailsResponse getUser(Long id) {
        return this.userRepository.findById(id)
                .map(this.userMapper::mapToUserDetailsResponse)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));
    }

    @Override
    public List<ClientContactResponse> getClientContacts(List<Long> userIds) {
        return userRepository.findAllById(userIds).stream()
                .map(userMapper::mapToBookingClientResponse)
                .toList();
    }

    @Override
    public List<Long> searchClientIds(String name) {
        if (!StringUtils.hasText(name)) {
            return List.of();
        }

        final var specification = UserSpecification.hasRoles(List.of(RoleEnum.CLIENT))
                .and(UserSpecification.hasNameContaining(name));

        return this.userRepository.findAll(specification)
                .stream()
                .map(User::getId)
                .toList();
    }
}
