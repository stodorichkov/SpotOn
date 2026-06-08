package com.example.restaurant.repository;

import com.example.restaurant.model.enity.RestaurantTable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    Page<RestaurantTable> findAllByRestaurantId(Long restaurantId, Pageable pageable);
}
