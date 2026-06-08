package com.example.restaurant.service;

import com.example.restaurant.model.payload.request.RestaurantTableRequest;
import com.example.restaurant.model.payload.response.RestaurantTableResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantTableService {
    void addTable(RestaurantTableRequest request, Long restaurantId);
    Page<RestaurantTableResponse> getTables(Long restaurantId, Pageable pageable);
    RestaurantTableResponse editTable(Long tableId, Long restaurantId, RestaurantTableRequest request);
}
