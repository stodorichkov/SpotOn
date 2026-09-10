package com.example.restaurant.service;

import com.example.restaurant.model.payload.filter.RestaurantFilter;
import com.example.restaurant.model.payload.request.RestaurantActiveStatusRequest;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.request.RestaurantReservationDurationRequest;
import com.example.restaurant.model.payload.request.RestaurantStatusRequest;
import com.example.restaurant.model.payload.request.RestaurantWorkingHoursRequest;
import com.example.restaurant.model.payload.response.RestaurantContactResponse;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

public interface RestaurantService {
    RestaurantResponse addRestaurant(RestaurantRequest request);
    Page<RestaurantResponse> getRestaurants(RestaurantFilter filter, Pageable pageable);
    Page<RestaurantResponse> getRestaurantsForManage(RestaurantFilter filter, Pageable pageable);
    RestaurantDetailsResponse getRestaurant(Long id);
    RestaurantDetailsResponse editRestaurant(Long id, RestaurantRequest request);
    RestaurantDetailsResponse updateRestaurantStatus(Long id, RestaurantStatusRequest request);
    RestaurantDetailsResponse updateRestaurantActiveStatus(Long id, RestaurantActiveStatusRequest request);
    RestaurantDetailsResponse updateWorkingHours(Long id, RestaurantWorkingHoursRequest request);
    RestaurantDetailsResponse updateReservationDuration(Long id, RestaurantReservationDurationRequest request);
    RestaurantDetailsResponse uploadRestaurantImage(Long id, MultipartFile file);
    RestaurantDetailsResponse deleteRestaurantImage(Long id, Long imageId);

    List<RestaurantContactResponse> getRestaurantsContact(List<Long> restaurantIds);
    void restaurantExists(Long id);
    List<Long> searchRestaurantIds(String name);
    void validateWithinWorkingHours(Long restaurantId, Instant dateTime);
}