package com.example.booking.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    @Column(nullable = false)
    private Long clientId;

    @Column(nullable = false)
    private Long restaurantId;

    private Long tableId;

    @Column(nullable = false)
    private Integer guestCount;

    @Column(nullable = false)
    private Boolean isSmoking;

    @Column(nullable = false)
    private Instant dateTime;
}
