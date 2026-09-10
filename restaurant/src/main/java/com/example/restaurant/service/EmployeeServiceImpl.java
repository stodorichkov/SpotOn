package com.example.restaurant.service;

import com.example.restaurant.client.AuthEmployeeClient;
import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.AccessDeniedException;
import com.example.restaurant.exception.BadRequestException;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.EmployeeMapper;
import com.example.restaurant.model.payload.filter.EmployeeFilter;
import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;
import com.example.restaurant.model.payload.response.UserDetailsResponse;
import com.example.restaurant.repository.EmployeeRepository;
import com.example.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

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

        if (restaurant.getDeletedAt() != null) {
            throw new BadRequestException(MessageConstants.CANNOT_ADD_EMPLOYEE_TO_INACTIVE_RESTAURANT);
        }

        final var employee = this.employeeMapper.mapFromAddManagerRequest(request);
        employee.setRestaurant(restaurant);

        this.employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void addEmployee(AddEmployeeRequest request, Long restaurantId) {
        final var restaurant = this.restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        if (restaurant.getDeletedAt() != null) {
            throw new BadRequestException(MessageConstants.CANNOT_ADD_EMPLOYEE_TO_INACTIVE_RESTAURANT);
        }

        final var employee = this.employeeMapper.mapFromAddEmployeeRequest(request);
        employee.setRestaurant(restaurant);

        this.employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void removeEmployee(Long restaurantId, Long employeeId) {
        final var employee = this.employeeRepository.findByUserIdAndDeletedAtIsNull(employeeId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.EMPLOYEE_NOT_FOUND));

        if (!employee.getRestaurant().getId().equals(restaurantId)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        employee.setDeletedAt(Instant.now());
        this.employeeRepository.save(employee);

        this.authEmployeeClient.removeEmployee(employeeId);
    }

    @Override
    @Transactional
    public void removeEmployee(Long employeeId) {
        final var employee = this.employeeRepository.findByUserIdAndDeletedAtIsNull(employeeId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.EMPLOYEE_NOT_FOUND));

        employee.setDeletedAt(Instant.now());
        this.employeeRepository.save(employee);

        this.authEmployeeClient.removeEmployee(employeeId);
    }

    @Override
    @Transactional
    public Page<UserDetailsResponse> getEmployees(Long restaurantId, EmployeeFilter filter, Pageable pageable) {
        var employeeIds = this.employeeRepository.findUserIdsByRestaurantId(restaurantId);

        if (filter.id() != null) {
            employeeIds = employeeIds.stream().filter(filter.id()::equals).toList();
        }

        if (employeeIds.isEmpty()) {
            return Page.empty(pageable);
        }

        final var sort = pageable.getSort().stream()
                .findFirst()
                .map(order -> order.getProperty() + "," + order.getDirection().name().toLowerCase())
                .orElse(null);

        final var matchingEmployees = this.authEmployeeClient.getEmployees(filter.email(), filter.name(), filter.phoneNumber(), filter.roles(), sort, employeeIds);

        final var total = matchingEmployees.size();
        final var start = Math.min((int) pageable.getOffset(), total);
        final var end = Math.min(start + pageable.getPageSize(), total);

        return new PageImpl<>(matchingEmployees.subList(start, end), pageable, total);
    }

    @Override
    @Transactional
    public void invalidateSessionsForRestaurant(Long restaurantId) {
        final var employeeIds = this.employeeRepository.findUserIdsByRestaurantId(restaurantId);

        if (!employeeIds.isEmpty()) {
            this.authEmployeeClient.invalidateSessions(employeeIds);
        }
    }

    @Override
    @Transactional
    public Long getRestaurantId(Long userId) {
        final var employee = this.employeeRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.EMPLOYEE_NOT_FOUND));

        final var restaurant = employee.getRestaurant();

        if (restaurant.getDeletedAt() != null) {
            throw new BadRequestException(MessageConstants.EMPLOYEE_RESTAURANT_INACTIVE);
        }

        return restaurant.getId();
    }

    @Override
    public void hasAccessToRestaurant(Long restaurantId, Long employeeId) {
        final var employee = this.employeeRepository.findByUserIdAndDeletedAtIsNull(employeeId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.EMPLOYEE_NOT_FOUND));

        if (!employee.getRestaurant().getId().equals(restaurantId)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }
    }
}