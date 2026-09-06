package com.example.restaurant.repository;

import com.example.restaurant.model.enity.RestaurantWorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantWorkingHoursRepository extends JpaRepository<RestaurantWorkingHours, Long> {
    List<RestaurantWorkingHours> findByRestaurantId(Long restaurantId);
    void deleteByRestaurantId(Long restaurantId);
}
