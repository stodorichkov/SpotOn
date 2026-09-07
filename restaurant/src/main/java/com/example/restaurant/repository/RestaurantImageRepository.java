package com.example.restaurant.repository;

import com.example.restaurant.model.enity.RestaurantImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantImageRepository extends JpaRepository<RestaurantImage, Long> {
    List<RestaurantImage> findByRestaurantIdOrderByIdAsc(Long restaurantId);
    List<RestaurantImage> findByRestaurantIdIn(List<Long> restaurantIds);
    void deleteByRestaurantId(Long restaurantId);
}
