package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RedisConstants;
import com.example.auth.exception.AccessDeniedException;
import com.example.auth.exception.BadRequestException;
import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.UserMapper;
import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.filter.EmployeeSearchFilter;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.repository.UserRepository;
import com.example.auth.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final StringRedisTemplate redisTemplate;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Override
    @Transactional
    public List<UserDetailsResponse> getEmployees(List<Long> userIds, EmployeeSearchFilter filter, String sort) {
        if (userIds == null || userIds.isEmpty()) {
            throw  new BadRequestException();
        }

        final var specification = UserSpecification.fromFilter(UserSpecification.hasIdIn(userIds), filter);

        return this.userRepository.findAll(specification, parseSort(sort))
                .stream()
                .map(this.userMapper::mapToUserDetailsResponse)
                .toList();
    }

    private Sort parseSort(String sort) {
        if (!StringUtils.hasText(sort)) {
            return Sort.by(Sort.Direction.ASC, "id");
        }

        final var parts = sort.split(",");
        final var direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return Sort.by(direction, parts[0]);
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
}
