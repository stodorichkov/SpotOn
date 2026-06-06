package com.example.restaurant.mapper.category;

import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RestaurantMapper {
    @Mapping(target = "categories", ignore = true)
    Restaurant map(RestaurantRequest request);
}
