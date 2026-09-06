package com.example.auth.service;

import com.example.auth.model.payload.request.ChangePasswordRequest;
import com.example.auth.model.payload.request.EditProfileRequest;
import com.example.auth.model.payload.response.ProfileResponse;

public interface ProfileService {
    ProfileResponse getProfile(Long id);
    void editProfile(Long id, EditProfileRequest request);
    void changeEmail(Long id, String newEmail);
    void changePassword(Long id, ChangePasswordRequest request);
}