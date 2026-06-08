package com.example.restaurant.mapper;

import com.example.restaurant.model.enity.RestaurantTable;
import com.example.restaurant.model.payload.request.RestaurantTableRequest;
import com.example.restaurant.model.payload.response.RestaurantTableResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RestaurantTableMapper {
    RestaurantTable mapFromRestaurantTableRequest(RestaurantTableRequest request);

    RestaurantTableResponse mapToRestaurantTableResponse(RestaurantTable table);
}
