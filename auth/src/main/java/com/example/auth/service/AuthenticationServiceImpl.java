package com.example.auth.service;

import com.example.auth.constants.AuthenticationConstants;
import com.example.auth.constants.MessageConstants;
import com.example.auth.constants.RedisConstants;
import com.example.auth.exception.AccessDeniedException;
import com.example.auth.exception.UnauthorizedException;
import com.example.auth.model.entity.User;
import com.example.auth.model.payload.request.LoginRequest;
import com.example.auth.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Override
    public String login(LoginRequest request) {
        final var user = this.userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UnauthorizedException(MessageConstants.INVALID_USERNAME_PASSWORD));

        if (!this.passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException(MessageConstants.INVALID_USERNAME_PASSWORD);
        }

        if (!user.isActive()) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        return this.generateJWT(user);
    }

    @Override
    public void logout(String jti, long expirationMs) {
        final var remainingTimeMs = expirationMs - System.currentTimeMillis();

        if (remainingTimeMs > 0) {
            final var redisKey = RedisConstants.BLACKLIST + jti;

            this.redisTemplate.opsForValue().set(
                    redisKey,
                    "",
                    remainingTimeMs,
                    TimeUnit.MILLISECONDS
            );
        }
    }

    private String generateJWT(User user) {
        final var claims = new HashMap<String, Object>();
        claims.put(AuthenticationConstants.JWT_ROLE, user.getRole().getName().name());

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
