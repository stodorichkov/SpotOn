package com.example.booking.config;

import com.example.booking.service.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@RequiredArgsConstructor
public class StatusConfig {
    private final StatusService statusService;

    @Bean
    @Order(1)
    CommandLineRunner initStatuses() {
        return args -> this.statusService.saveAllStatuses();
    }
}
