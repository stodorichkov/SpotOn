package com.example.restaurant.mapper;

import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.enums.CategoryEnum;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.BookingRestaurantResponse;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RestaurantMapper {
    @Mapping(target = "categories", ignore = true)
    Restaurant mapFromRestaurantRequest(RestaurantRequest request);

    RestaurantResponse mapToRestaurantResponse(Restaurant restaurant);

    RestaurantDetailsResponse mapToRestaurantDetailsResponse(Restaurant restaurant);

    BookingRestaurantResponse mapToBookingRestaurantResponse(Restaurant restaurant);

    @Mapping(target = "categories", ignore = true)
    void updateFromRestaurantRequest(RestaurantRequest request, @MappingTarget Restaurant restaurant);

    default CategoryEnum mapToCategoryEnum(Category category) {
        return category.getName();
    }
}
