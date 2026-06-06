package com.example.restaurant.service;

import com.example.restaurant.model.payload.request.RestaurantRequest;

public interface RestaurantService {
    void addRestaurant(RestaurantRequest request);
}
