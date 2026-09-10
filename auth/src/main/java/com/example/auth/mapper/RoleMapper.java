package com.example.auth.mapper;

import com.example.auth.model.entity.Role;
import com.example.auth.model.enums.RoleEnum;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RoleMapper {
    Role map(RoleEnum name);
}
