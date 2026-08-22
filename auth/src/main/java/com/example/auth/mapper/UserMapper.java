package com.example.auth.mapper;

import com.example.auth.model.payload.response.ClientContactResponse;
import com.example.auth.model.entity.User;
import com.example.auth.model.payload.request.*;
import com.example.auth.model.payload.response.ProfileResponse;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import com.example.auth.model.payload.response.EmployeeRegistrationResponse;
import org.mapstruct.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    @Mapping(target = "password", source = "password", qualifiedByName = "encodePassword")
    User mapFromClientRegistrationRequest(ClientRegistrationRequest request, @Context PasswordEncoder passwordEncoder);

    User mapFromEmployeeRegistrationRequest(EmployeeRegistrationRequest request);

    @Mapping(target = "role", source = "role.name")
    UserResponse mapToUserResponse(User user);

    @Mapping(target = "role", source = "role.name")
     UserDetailsResponse mapToUserDetailsResponse(User user);

    @Mapping(target = "role", source = "role.name")
    ProfileResponse mapToProfileResponse(User user);

    void updateFromEditProfileRequest(EditProfileRequest request, @MappingTarget User user);

    @Mapping(target = "password", source = "newPassword", qualifiedByName = "encodePassword")
    void updateFromChangePasswordRequest(
            ChangePasswordRequest request,
            @MappingTarget User user,
            @Context PasswordEncoder passwordEncoder
    );

    ClientContactResponse mapToBookingClientResponse(User user);

    @Mapping(target = "role", source = "user.role.name")
    @Mapping(target = "password", source = "password")
    EmployeeRegistrationResponse mapToEmployeeRegistrationResponse(User user, String password);

    @Named("encodePassword")
    default String encodePassword(String rawPassword, @Context PasswordEncoder passwordEncoder) {
        return Optional.ofNullable(rawPassword)
                .map(passwordEncoder::encode)
                .orElse(null);
    }
}
