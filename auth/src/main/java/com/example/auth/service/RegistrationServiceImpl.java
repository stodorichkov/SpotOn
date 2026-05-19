package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.exception.BadRequestException;

import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.user.UserMapper;
import com.example.auth.model.entity.Role;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.repository.RoleRepository;
import com.example.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public void registerClient(ClientRegistrationRequest request) {


        Optional.of(request)
                .filter(req -> this.userRepository.findByUsername(req.username()).isEmpty())
                .map(this.userMapper::map)
                .map(user -> {
                    Role clientRole = roleRepository.findByName(RoleEnum.CLIENT)
                            .orElseThrow(() -> new NotFoundException(MessageConstants.ROLE_NOT_FOUND));
                    user.setRole(clientRole);

                    return user;
                })
                .map(this.userRepository::save)
                .orElseThrow(() -> new BadRequestException(MessageConstants.USER_EXISTS));
    }
}
