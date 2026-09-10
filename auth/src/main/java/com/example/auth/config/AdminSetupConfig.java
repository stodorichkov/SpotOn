package com.example.auth.config;

import com.example.auth.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@RequiredArgsConstructor
@Configuration
public class AdminSetupConfig {
    private final RegistrationService registrationService;

    @Bean
    @Order(2)
    CommandLineRunner initAdmin () {
        return args -> registrationService.registerAdmin();
    }
}
