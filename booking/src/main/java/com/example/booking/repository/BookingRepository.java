package com.example.booking.repository;

import com.example.booking.model.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findAllByClientId(Long clientId, Pageable pageable);
    Page<Booking> findAllByRestaurantId(Long restaurantId, Pageable pageable);
    List<Booking> findAllByTableIdAndDateTimeBetween(Long tableId, Instant start, Instant end);
}
