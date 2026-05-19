package com.example.auth.mapper.user;

import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@RequiredArgsConstructor
@Component
public class PasswordMappingHelper {
    private final BCryptPasswordEncoder passwordEncoder;

    @Named("encodePassword")
    public String encode(String rawPassword) {
        return Optional.ofNullable(rawPassword)
                .map(passwordEncoder::encode)
                .orElse(null);
    }
}
