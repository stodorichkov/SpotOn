package com.example.restaurant.mapper;

import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.payload.response.CategoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CategoryMapper {
    @Mapping(target = "isActive", expression = "java(category.getDeletedAt() == null)")
    CategoryResponse mapToCategoryResponse(Category category);
}
