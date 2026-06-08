package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.RestaurantTableMapper;
import com.example.restaurant.model.payload.request.RestaurantTableRequest;
import com.example.restaurant.repository.RestaurantRepository;
import com.example.restaurant.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantTableServiceImpl implements RestaurantTableService {
    private final RestaurantTableRepository restaurantTableRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantTableMapper restaurantTableMapper;

    @Override
    public void addTable(RestaurantTableRequest request, Long restaurantId) {
        final var restaurant = this.restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var table = this.restaurantTableMapper.mapFromRestaurantTableRequest(request);
        table.setRestaurant(restaurant);

        this.restaurantTableRepository.save(table);
    }
}
