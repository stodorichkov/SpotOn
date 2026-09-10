package com.example.auth.controller;

import com.example.auth.constants.HeaderConstants;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.request.ChangePasswordRequest;
import com.example.auth.model.payload.request.ChangeEmailRequest;
import com.example.auth.model.payload.request.EditProfileRequest;
import com.example.auth.model.payload.response.ProfileResponse;
import com.example.auth.service.AuthorizationService;
import com.example.auth.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final AuthorizationService authorizationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ProfileResponse getProfile(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.values());

        return this.profileService.getProfile(userIdHeader);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void editProfile(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @Valid @RequestBody EditProfileRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader,
                RoleEnum.CLIENT,
                RoleEnum.EMPLOYEE,
                RoleEnum.MANAGER
        );

        this.profileService.editProfile(userIdHeader, request);
    }

    @PatchMapping("/email")
    @ResponseStatus(HttpStatus.OK)
    public void changeEmail(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @Valid @RequestBody ChangeEmailRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.values());

        this.profileService.changeEmail(userIdHeader, request.newEmail());
    }

    @PatchMapping("/password")
    @ResponseStatus(HttpStatus.OK)
    public void changePassword(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.USER_ID) Long userIdHeader,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.values());

        this.profileService.changePassword(userIdHeader, request);
    }
}