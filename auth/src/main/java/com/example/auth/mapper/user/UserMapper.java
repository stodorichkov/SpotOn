package com.example.auth.mapper.user;

import com.example.auth.model.entity.User;
import com.example.auth.model.payload.request.ChangePasswordRequest;
import com.example.auth.model.payload.request.ClientRegistrationRequest;
import com.example.auth.model.payload.request.EditProfileRequest;
import com.example.auth.model.payload.request.StaffRegistrationRequest;
import com.example.auth.model.payload.response.ProfileResponse;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = PasswordMappingHelper.class)
public interface UserMapper {
    @Mapping(target = "password", source = "password", qualifiedByName = "encodePassword")
    User mapFromClientRegistrationRequest(ClientRegistrationRequest request);

    User mapFromStaffRegistrationRequest(StaffRegistrationRequest request);

    @Mapping(target = "roleName", source = "role.name")
    UserResponse mapToUserResponse(User user);

    @Mapping(target = "roleName", source = "role.name")
    UserDetailsResponse mapToUserDetailsResponse(User user);

    @Mapping(target = "roleName", source = "role.name")
    ProfileResponse mapToProfileResponse(User user);

    void updateFromEditProfileRequest(EditProfileRequest request, @MappingTarget User user);

    @Mapping(target = "password", source = "newPassword", qualifiedByName = "encodePassword")
    void updateFromChangePasswordRequest(ChangePasswordRequest request, @MappingTarget User user);
}
