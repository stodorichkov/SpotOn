package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.exception.BadRequestException;

import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.user.PasswordMappingHelper;
import com.example.auth.mapper.user.UserMapper;
import com.example.auth.model.entity.Role;
import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.model.payload.request.StaffRegistrationRequest;
import com.example.auth.model.payload.response.StaffRegistrationResponse;
import com.example.auth.repository.RoleRepository;
import com.example.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordMappingHelper passwordMappingHelper;

    @Value("${admin.username}")
    private String adminUsername;
    @Value("${admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void registerClient(ClientRegistrationRequest request) {
        if (this.userRepository.findByUsername(request.username()).isPresent()) {
            throw new BadRequestException(MessageConstants.USER_EXISTS);
        }

        final var role = this.getRole(RoleEnum.CLIENT);
        final var user = this.userMapper.map(request);
        user.setRole(role);

        this.userRepository.save(user);
    }

    @Override
    @Transactional
    public StaffRegistrationResponse registerStaff(StaffRegistrationRequest request, RoleEnum roleName)
    {
        final var role = this.getRole(roleName);
        final var username = this.generateUsername(roleName);
        final var password = this.generatePassword();

        final var user = this.userMapper.map(request);
        user.setUsername(username);
        user.setPassword(passwordMappingHelper.encode(password));
        user.setRole(role);
        this.userRepository.save(user);

        return new StaffRegistrationResponse(username, password);
    }

    @Override
    @Transactional
    public void registerAdmin()
    {
        if (this.userRepository.findByUsername(this.adminUsername).isPresent()) {
            return;
        }

        final var role = this.getRole(RoleEnum.ADMIN);

        final var user = new User();
        user.setUsername(this.adminUsername);
        user.setPassword(passwordMappingHelper.encode(adminPassword));
        user.setRole(role);
        this.userRepository.saveAndFlush(user);

        System.out.println(MessageConstants.ADD_ADMIN);
    }

    private Role getRole(RoleEnum roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new NotFoundException(MessageConstants.ROLE_NOT_FOUND));
    }

    private String generateUsername(RoleEnum roleName) {
        var prefix = "e";
        if (roleName == RoleEnum.MANAGER) {
            prefix = "m";
        }

        final var timestamp = System.currentTimeMillis();
        final var randomNumber = ThreadLocalRandom.current().nextInt(10, 100);

        return String.format("%s%d%d", prefix, timestamp, randomNumber);
    }

    private String generatePassword() {
        final var generator = KeyGenerators.string();

        return generator.generateKey().substring(0, 8);
    }
}
