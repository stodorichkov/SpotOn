package com.example.restaurant.config;

import com.example.restaurant.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@RequiredArgsConstructor
public class CategoryConfig {
    private final CategoryService categoryService;

    @Bean
    @Order(1)
    CommandLineRunner initCategories() {
        return args -> categoryService.saveAllCategories();
    }
}
