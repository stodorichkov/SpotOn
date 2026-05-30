package com.example.auth.service;

import com.example.auth.constants.AuthenticationConstants;
import com.example.auth.constants.MessageConstants;
import com.example.auth.exception.NotFoundException;
import com.example.auth.exception.UnauthorizedException;
import com.example.auth.model.entity.User;
import com.example.auth.model.payload.request.LoginRequest;
import com.example.auth.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Override
    public String login(LoginRequest request) {
        final var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UnauthorizedException(MessageConstants.INVALID_USERNAME_PASSWORD));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException(MessageConstants.INVALID_USERNAME_PASSWORD);
        }

        return this.generateJWT(user);
    }

    private String generateJWT(User user) {
        final var claims = new HashMap<String, Object>();
        claims.put(AuthenticationConstants.JWT_ROLE, user.getRole().getName().name());

        final var jti = UUID.randomUUID().toString();

        final var now = new Date();
        final var exp = new Date(now.getTime() + jwtExpirationMs);

        final var key =  Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));

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
