package com.example.restaurant.service;

import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantService {
    void addRestaurant(RestaurantRequest request);
    Page<RestaurantResponse> getRestaurants(Pageable pageable);
    RestaurantDetailsResponse getRestaurant(Long id);
}
