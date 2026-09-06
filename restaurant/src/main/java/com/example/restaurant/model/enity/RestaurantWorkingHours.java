package com.example.restaurant.model.enity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "restaurant_working_hours", uniqueConstraints = @UniqueConstraint(columnNames = {"restaurant_id", "day_of_week"}))
@Data
public class RestaurantWorkingHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private Boolean closed = false;

    private LocalTime openTime;

    private LocalTime closeTime;
}
