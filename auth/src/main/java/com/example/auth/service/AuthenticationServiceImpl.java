package com.example.auth.service;

import com.example.auth.client.RestaurantEmployeeClient;
import com.example.auth.constants.JwtConstants;
import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RedisConstants;
import com.example.auth.exception.NotFoundException;
import com.example.auth.exception.UnauthorizedException;
import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.request.LoginRequest;
import com.example.auth.model.payload.request.PasswordResetRequest;
import com.example.auth.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    private final RestaurantEmployeeClient restaurantEmployeeClient;
    private final EmailService emailService;

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Override
    @Transactional
    public String login(LoginRequest request) {
        final var user = this.userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException(MessageConstants.INVALID_EMAIL_PASSWORD));

        if (!this.passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException(MessageConstants.INVALID_EMAIL_PASSWORD);
        }

        return this.generateJWT(user);
    }

    @Override
    public void logout(String jti, long expirationMs) {
        final var remainingTimeMs = expirationMs - System.currentTimeMillis();

        if (remainingTimeMs > 0) {
            final var redisKey = RedisConstants.DEACTIVATE + jti;

            this.redisTemplate.opsForValue().set(
                    redisKey,
                    "",
                    remainingTimeMs,
                    TimeUnit.MILLISECONDS
            );
        }
    }

    @Override
    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        final var user = this.userRepository.findByEmail(request.email())
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        final var newPassword = this.generatePassword();

        user.setPassword(this.passwordEncoder.encode(newPassword));
        this.userRepository.save(user);

        this.emailService.sendPasswordResetEmail(user.getEmail(), newPassword);
    }

    private String generatePassword() {
        final var generator = KeyGenerators.string();

        return generator.generateKey().substring(0, 8);
    }

    private String generateJWT(User user) {
        final var claims = new HashMap<String, Object>();
        claims.put(JwtConstants.ROLE, user.getRole().getName().name());

        final var role = user.getRole().getName();
        if (role.equals(RoleEnum.EMPLOYEE) || role.equals(RoleEnum.MANAGER)) {
            final var restaurantId = this.restaurantEmployeeClient.getRestaurantId(user.getId());

            claims.put(JwtConstants.RESTAURANT_ID, restaurantId);
        }

        final var jti = UUID.randomUUID().toString();

        final var now = new Date();
        final var exp = new Date(now.getTime() + this.jwtExpirationMs);

        final var key =  Keys.hmacShaKeyFor(Decoders.BASE64.decode(this.jwtSecret));

        return Jwts.builder()
                .subject(user.getId().toString())
                .claims(claims)
                .id(jti)
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }
}
