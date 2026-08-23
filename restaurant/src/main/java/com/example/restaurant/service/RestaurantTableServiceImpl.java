package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.AccessDeniedException;
import com.example.restaurant.exception.BadRequestException;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.RestaurantTableMapper;
import com.example.restaurant.model.payload.request.RestaurantTableRequest;
import com.example.restaurant.model.payload.request.RestaurantTableValidationRequest;
import com.example.restaurant.model.payload.response.RestaurantTableResponse;
import com.example.restaurant.repository.RestaurantRepository;
import com.example.restaurant.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RestaurantTableServiceImpl implements RestaurantTableService {
    private final RestaurantTableRepository restaurantTableRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantTableMapper restaurantTableMapper;

    @Override
    @Transactional
    public RestaurantTableResponse addTable(RestaurantTableRequest request, Long restaurantId) {
        final var restaurant = this.restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var table = this.restaurantTableMapper.mapFromRestaurantTableRequest(request);
        table.setRestaurant(restaurant);

        final var savedTable = this.restaurantTableRepository.save(table);
        return this.restaurantTableMapper.mapToRestaurantTableResponse(savedTable);
    }

    @Override
    public Page<RestaurantTableResponse> getTables(Long restaurantId, Pageable pageable) {
        return this.restaurantTableRepository.findAllByRestaurantId(restaurantId, pageable)
                .map(this.restaurantTableMapper::mapToRestaurantTableResponse);
    }

    @Override
    @Transactional
    public RestaurantTableResponse editTable(Long tableId, Long restaurantId, RestaurantTableRequest request) {
        final var table = this.restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.TABLE_NOT_FOUND));

        if (!table.getRestaurant().getId().equals(restaurantId)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        this.restaurantTableMapper.updateFromRestaurantTableRequest(request, table);
        this.restaurantTableRepository.save(table);

        return this.restaurantTableMapper.mapToRestaurantTableResponse(table);
    }

    @Override
    @Transactional
    public void removeTable(Long tableId, Long restaurantId) {
        final var table = this.restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.TABLE_NOT_FOUND));

        if (!table.getRestaurant().getId().equals(restaurantId)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        this.restaurantTableRepository.deleteById(tableId);
    }

    @Override
    @Transactional
    public void validateTable(RestaurantTableValidationRequest request, Long restaurantId) {
        final var table = this.restaurantTableRepository.findById(request.tableId())
                .orElseThrow(() -> new NotFoundException(MessageConstants.TABLE_NOT_FOUND));

        if (!table.getRestaurant().getId().equals(restaurantId)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        } else if (table.getCapacity() < request.guestCount()) {
            throw new BadRequestException(MessageConstants.TABLE_NOT_MATCH_REQUIREMENTS);
        } else if (request.isSmoking() && !table.getIsSmokingAllowed()) {
            throw new BadRequestException(MessageConstants.TABLE_NOT_MATCH_REQUIREMENTS);
        }
    }
}