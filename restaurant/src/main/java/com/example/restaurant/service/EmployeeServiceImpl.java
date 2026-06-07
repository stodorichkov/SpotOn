package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.EmployeeMapper;
import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;
import com.example.restaurant.repository.EmployeeRepository;
import com.example.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final RestaurantRepository restaurantRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional
    public void addEmployee(AddEmployeeRequest request, Long restaurantId) {
        final var restaurant = this.restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var employee = this.employeeMapper.mapFromAddEmployeeRequest(request);
        employee.setRestaurant(restaurant);

        this.employeeRepository.save(employee);
    }

    @Override
    public void addManager(AddManagerRequest request) {
        final var restaurant = this.restaurantRepository.findById(request.restaurantId())
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var employee = this.employeeMapper.mapFromAddManagerRequest(request);
        employee.setRestaurant(restaurant);

        this.employeeRepository.save(employee);
    }
}
