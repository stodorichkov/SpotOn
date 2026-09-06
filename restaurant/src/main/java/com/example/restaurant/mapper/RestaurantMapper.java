package com.example.restaurant.mapper;

import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.enity.RestaurantWorkingHours;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.CategoryResponse;
import com.example.restaurant.model.payload.response.RestaurantContactResponse;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import com.example.restaurant.model.payload.response.WorkingHoursEntryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RestaurantMapper {
    @Mapping(target = "categories", ignore = true)
    Restaurant mapFromRestaurantRequest(RestaurantRequest request);

    RestaurantResponse mapToRestaurantResponse(Restaurant restaurant);

    RestaurantDetailsResponse mapToRestaurantDetailsResponse(Restaurant restaurant, List<RestaurantWorkingHours> workingHours);

    RestaurantContactResponse mapToRestaurantContactResponse(Restaurant restaurant);

    WorkingHoursEntryResponse mapToWorkingHoursEntryResponse(RestaurantWorkingHours workingHours);

    @Mapping(target = "categories", ignore = true)
    void updateFromRestaurantRequest(RestaurantRequest request, @MappingTarget Restaurant restaurant);

    default CategoryResponse mapToCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryResponse(category.getId(), category.getName());
    }
}
