package com.example.restaurant.service;

import com.example.restaurant.model.payload.filter.TableFilter;
import com.example.restaurant.model.payload.request.RestaurantTableRequest;
import com.example.restaurant.model.payload.request.RestaurantTableValidationRequest;
import com.example.restaurant.model.payload.response.RestaurantTableResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantTableService {
    RestaurantTableResponse addTable(RestaurantTableRequest request, Long restaurantId);
    Page<RestaurantTableResponse> getTables(Long restaurantId, TableFilter filter, Pageable pageable);
    RestaurantTableResponse editTable(Long tableId, Long restaurantId, RestaurantTableRequest request);
    void removeTable(Long tableId, Long restaurantId);
    Integer validateTable(RestaurantTableValidationRequest request, Long restaurantId);
}