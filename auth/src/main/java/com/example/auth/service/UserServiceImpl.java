package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RedisConstants;
import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.filter.UserFilter;
import com.example.auth.model.payload.request.BookingStatusEmailRequest;
import com.example.auth.model.payload.request.UserActiveStatusRequest;
import com.example.auth.model.payload.response.ClientContactResponse;
import com.example.auth.exception.BadRequestException;
import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.UserMapper;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import com.example.auth.repository.UserRepository;
import com.example.auth.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Override
    public Page<UserResponse> getUsers(UserFilter filter, Pageable pageable) {
        final var specification = UserSpecification.fromFilter(filter);

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
    @Transactional
    public UserDetailsResponse updateUserActiveStatus(Long id, UserActiveStatusRequest request, Long requesterId) {
        if (!request.isActive() && id.equals(requesterId)) {
            throw new BadRequestException(MessageConstants.CANNOT_DEACTIVATE_SELF);
        }

        final var user = this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        user.setDeletedAt(request.isActive() ? null : Instant.now());
        this.userRepository.save(user);

        final var redisKey = RedisConstants.DEACTIVATE + id;
        if (request.isActive()) {
            this.redisTemplate.delete(redisKey);
        } else {
            this.redisTemplate.opsForValue().set(redisKey, "", this.jwtExpirationMs, TimeUnit.MILLISECONDS);
        }

        return this.userMapper.mapToUserDetailsResponse(user);
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

    @Override
    public void sendBookingStatusEmail(BookingStatusEmailRequest request) {
        final var user = this.userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        this.emailService.sendBookingStatusEmail(
                user.getEmail(),
                request.restaurantName(),
                request.dateTime(),
                request.status()
        );
    }
}
