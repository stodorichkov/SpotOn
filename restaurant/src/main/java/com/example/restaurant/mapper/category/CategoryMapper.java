package com.example.restaurant.mapper.category;

import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.enums.CategoryEnum;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CategoryMapper {
    Category map(CategoryEnum name);
}
