package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RedisConstants;
import com.example.auth.exception.AccessDeniedException;
import com.example.auth.exception.BadRequestException;
import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.UserMapper;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import com.example.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final StringRedisTemplate redisTemplate;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

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

    @Override
    @Transactional
    public void removeEmployee(Long id) {
        final var user = this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        if (!user.getRole().getName().equals(RoleEnum.EMPLOYEE)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        this.userRepository.deleteById(id);

        final var redisKey = RedisConstants.DEACTIVATE + id;
        this.redisTemplate.opsForValue().set(
                redisKey,
                "",
                jwtExpirationMs,
                TimeUnit.MILLISECONDS
        );
    }

    @Override
    @Transactional
    public List<UserDetailsResponse> getEmployees(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            throw  new BadRequestException();
        }

        return this.userRepository.findAllById(userIds)
                .stream()
                .map(this.userMapper::mapToUserDetailsResponse)
                .toList();
    }
}
