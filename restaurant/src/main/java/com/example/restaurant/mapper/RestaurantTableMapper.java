package com.example.restaurant.mapper;

import com.example.restaurant.model.enity.RestaurantTable;
import com.example.restaurant.model.payload.request.RestaurantTableRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RestaurantTableMapper {
    RestaurantTable mapFromRestaurantTableRequest(RestaurantTableRequest request);
}
