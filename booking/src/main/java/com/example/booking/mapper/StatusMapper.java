package com.example.booking.mapper;

import com.example.booking.model.entity.Status;
import com.example.booking.model.enums.StatuEnum;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface StatusMapper {
    Status map(StatuEnum name);
}
