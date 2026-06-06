package com.example.restaurant.mapper;

import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.enums.CategoryEnum;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RestaurantMapper {
    @Mapping(target = "categories", ignore = true)
    Restaurant mapFromRestaurantRequest(RestaurantRequest request);

    RestaurantResponse mapToRestaurantResponse(Restaurant restaurant);

    default CategoryEnum mapToCategoryEnum(Category category) {
        return category.getName();
    }
}
