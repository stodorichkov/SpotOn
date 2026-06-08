package com.example.restaurant.service;

import com.example.restaurant.model.payload.request.RestaurantTableRequest;

public interface RestaurantTableService {
    void addTable(RestaurantTableRequest request, Long restaurantId);

}
