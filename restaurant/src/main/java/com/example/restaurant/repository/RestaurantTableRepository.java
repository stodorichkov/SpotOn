package com.example.restaurant.repository;

import com.example.restaurant.model.enity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long>, JpaSpecificationExecutor<RestaurantTable> {
    Optional<RestaurantTable> findByIdAndDeletedAtIsNull(Long id);
}
