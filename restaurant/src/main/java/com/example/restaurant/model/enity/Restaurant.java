package com.example.restaurant.model.enity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "restaurants")
@Data
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "restaurants_categories",
            joinColumns = @JoinColumn(name = "restaurant_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private Boolean isOpen = false;

    @Column(nullable = false, columnDefinition = "integer not null default 120")
    private Integer reservationDurationMinutes = 120;

    @Column
    private Instant deletedAt;
}
