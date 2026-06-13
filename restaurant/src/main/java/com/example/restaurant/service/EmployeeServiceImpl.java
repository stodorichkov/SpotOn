package com.example.restaurant.service;

import com.example.restaurant.client.AuthEmployeeClient;
import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.AccessDeniedException;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.EmployeeMapper;
import com.example.restaurant.model.enity.Employee;
import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;
import com.example.restaurant.model.payload.response.UserDetailsResponse;
import com.example.restaurant.repository.EmployeeRepository;
import com.example.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final RestaurantRepository restaurantRepository;
    private final EmployeeMapper employeeMapper;
    private final AuthEmployeeClient authEmployeeClient;

    @Override
    @Transactional
    public void addManager(AddManagerRequest request) {
        final var restaurant = this.restaurantRepository.findById(request.restaurantId())
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var employee = this.employeeMapper.mapFromAddManagerRequest(request);
        employee.setRestaurant(restaurant);

        this.employeeRepository.save(employee);
    }

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
    @Transactional
    public void removeEmployee(Long restaurantId, Long employeeId) {
        final var employee = this.employeeRepository.findByUserId(employeeId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.EMPLOYEE_NOT_FOUND));

        if (!employee.getRestaurant().getId().equals(restaurantId)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        this.employeeRepository.deleteById(employee.getId());

        this.authEmployeeClient.removeEmployee(employeeId);
    }

    @Override
    @Transactional
    public Page<UserDetailsResponse> getEmployees(Long restaurantId, Pageable pageable) {
        final var employeeIds = this.employeeRepository.findAllByRestaurantId(restaurantId, pageable)
                .map(Employee::getUserId);

        if (employeeIds.isEmpty()) {
            return Page.empty(pageable);
        }

        final var usersDetails = this.authEmployeeClient.getEmployees(employeeIds.getContent());
        final var detailsMap = usersDetails.stream()
                .collect(Collectors.toMap(UserDetailsResponse::id, dto -> dto));

        return employeeIds.map(detailsMap::get);
    }

    @Override
    @Transactional
    public Long getRestaurantId(Long userId) {
        return this.employeeRepository.findByUserId(userId)
                .map(Employee::getRestaurant)
                .map(Restaurant::getId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.EMPLOYEE_NOT_FOUND));
    }

    @Override
    public void hasAccessToRestaurant(Long restaurantId, Long employeeId) {
        final var employee = this.employeeRepository.findByUserId(employeeId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.EMPLOYEE_NOT_FOUND));

        if (!employee.getRestaurant().getId().equals(restaurantId)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }
    }
}
