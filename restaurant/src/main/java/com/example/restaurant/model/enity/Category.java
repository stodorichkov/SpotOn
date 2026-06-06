package com.example.restaurant.model.enity;

import com.example.restaurant.model.enums.CategoryEnum;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private CategoryEnum name;
}
