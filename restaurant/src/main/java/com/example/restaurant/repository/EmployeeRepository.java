package com.example.restaurant.repository;

import com.example.restaurant.model.enity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUserId(Long userId);

    @Query("select e.userId from Employee e where e.restaurant.id = :restaurantId")
    List<Long> findUserIdsByRestaurantId(Long restaurantId);
}
