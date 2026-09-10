package com.example.booking.repository;

import com.example.booking.model.entity.Status;
import com.example.booking.model.enums.StatuEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
    Optional<Status> findByName(StatuEnum name);
}
