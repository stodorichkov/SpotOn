package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.exception.BadRequestException;
import com.example.auth.exception.NotFoundException;
import com.example.auth.mapper.UserMapper;
import com.example.auth.model.payload.request.ChangePasswordRequest;
import com.example.auth.model.payload.request.EditProfileRequest;
import com.example.auth.model.payload.response.ProfileResponse;
import com.example.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public ProfileResponse getProfile(Long id) {
        return this.userRepository.findById(id)
                .map(this.userMapper::mapToProfileResponse)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public ProfileResponse editProfile(Long id, EditProfileRequest request) {
        return this.userRepository.findById(id)
                .map(user -> {
                    this.userMapper.updateFromEditProfileRequest(request, user);
                    return this.userRepository.save(user);
                })
                .map(this.userMapper::mapToProfileResponse)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public void changeUsername(Long id, String newUsername) {
        if (this.userRepository.findByUsername(newUsername).isPresent()) {
            throw new BadRequestException(MessageConstants.USER_EXISTS);
        }

        final var user = this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        user.setUsername(newUsername);
        this.userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        final var user = this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        if (!this.passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException(MessageConstants.WRONG_PASSWORD);
        }

        this.userMapper.updateFromChangePasswordRequest(request, user, passwordEncoder);

        this.userRepository.save(user);
    }
}