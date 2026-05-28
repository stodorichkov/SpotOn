package com.example.auth.config;

import com.example.auth.constants.MessageConstants;
import com.example.auth.mapper.role.RoleMapper;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.Arrays;

@RequiredArgsConstructor
@Configuration
public class RoleSetupConfig {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Bean
    @Order(1)
    CommandLineRunner initRoles () {
        return args -> Arrays.stream(RoleEnum.values())
                .filter(roleName -> roleRepository.findByName(roleName).isEmpty())
                .map(roleMapper::map)
                .forEach(newRole -> {
                    roleRepository.saveAndFlush(newRole);
                    System.out.println(MessageConstants.ADD_ROLE + newRole.getName());
                });
    }
}
