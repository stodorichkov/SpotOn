package com.example.auth.mapper.user;

import com.example.auth.model.entity.User;
import com.example.auth.model.payload.request.ClientRegistrationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = PasswordMappingHelper.class)
public interface UserMapper {
    @Mapping(target = "password", source = "password", qualifiedByName = "encodePassword")
    User map(ClientRegistrationRequest request);
}
