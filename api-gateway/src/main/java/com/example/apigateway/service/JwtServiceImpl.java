package com.example.apigateway.service;

import com.example.apigateway.constants.JwtConstants;
import com.example.apigateway.constants.RedisConstants;
import com.example.apigateway.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    private final StringRedisTemplate redisTemplate;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Claims extractAllClaims(String token) {
        try {
            final var key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(this.jwtSecret));

            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            throw new UnauthorizedException();
        }
    }

    @Override
    public String extractJti(Claims claims) {
        return Optional.ofNullable(claims.getId())
                .filter(jti -> {
                    final var redisKey = RedisConstants.DEACTIVATE + jti;
                    return !Boolean.TRUE.equals(this.redisTemplate.hasKey(redisKey));
                })
                .orElseThrow(UnauthorizedException::new);
    }

    @Override
    public Long extractUserId(Claims claims) {
        return Optional.ofNullable(claims.getSubject())
                .map(Long::parseLong)
                .filter(userId -> {
                    final var redisKey = RedisConstants.DEACTIVATE + userId;
                    return !Boolean.TRUE.equals(this.redisTemplate.hasKey(redisKey));
                })
                .orElseThrow(UnauthorizedException::new);
    }

    @Override
    public String extractRole(Claims claims) {
        return Optional.ofNullable(claims.get(JwtConstants.ROLE, String.class))
                .orElseThrow(UnauthorizedException::new);
    }

    @Override
    public Long extractRestaurantId(Claims claims) {
        return Optional.ofNullable(claims.get(JwtConstants.RESTAURANT_ID, Long.class))
                .orElseThrow(UnauthorizedException::new);
    }

    @Override
    public Long extractExpiration(Claims claims) {
        return Optional.ofNullable(claims.getExpiration())
                .map(Date::getTime)
                .orElseThrow(UnauthorizedException::new);
    }
}
