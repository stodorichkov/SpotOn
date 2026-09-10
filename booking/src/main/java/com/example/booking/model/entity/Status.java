package com.example.booking.model.entity;

import com.example.booking.model.enums.StatuEnum;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "statuses")
@Data
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private StatuEnum name;
}
