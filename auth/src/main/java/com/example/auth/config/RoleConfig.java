package com.example.auth.config;

import com.example.auth.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@RequiredArgsConstructor
public class RoleConfig {
    private final RoleService roleService;

    @Bean
    @Order(1)
    CommandLineRunner initRoles () {
        return args -> this.roleService.saveAllRoles();
    }
}
