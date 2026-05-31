package com.example.auth.service;

import com.example.auth.model.payload.request.ChangePasswordRequest;
import com.example.auth.model.payload.request.ChangeUsernameRequest;
import com.example.auth.model.payload.request.EditProfileRequest;
import com.example.auth.model.payload.response.ProfileResponse;

public interface ProfileService {
    ProfileResponse getProfile(Long id);
    ProfileResponse editProfile(Long id, EditProfileRequest request);
    String changeUsername(Long id, ChangeUsernameRequest request);
    void changePassword(Long id, ChangePasswordRequest request);
}
