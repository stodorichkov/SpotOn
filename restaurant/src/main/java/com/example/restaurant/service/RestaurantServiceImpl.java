package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.RestaurantMapper;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.RestaurantContactResponse;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import com.example.restaurant.repository.CategoryRepository;
import com.example.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantMapper restaurantMapper;

    @Override
    @Transactional
    public void addRestaurant(RestaurantRequest request) {
        final var restaurant = this.restaurantMapper.mapFromRestaurantRequest(request);

        final var categories = request.categories()
                .stream()
                .map(name -> this.categoryRepository.findByName(name)
                        .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND))
                )
                .collect(Collectors.toSet());

        restaurant.setCategories(categories);

        this.restaurantRepository.save(restaurant);
    }

    @Override
    public Page<RestaurantResponse> getRestaurants(Pageable pageable) {
        return this.restaurantRepository.findAll(pageable)
                .map(this.restaurantMapper::mapToRestaurantResponse);
    }

    @Override
    public RestaurantDetailsResponse getRestaurant(Long id) {
        return this.restaurantRepository.findById(id)
                .map(this.restaurantMapper::mapToRestaurantDetailsResponse)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse editRestaurant(Long id, RestaurantRequest request) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        this.restaurantMapper.updateFromRestaurantRequest(request, restaurant);

        final var categories = request.categories()
                .stream()
                .map(name -> this.categoryRepository.findByName(name)
                        .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND))
                )
                .collect(Collectors.toSet());

        restaurant.setCategories(categories);

        this.restaurantRepository.save(restaurant);

        return this.restaurantMapper.mapToRestaurantDetailsResponse(restaurant);
    }

    @Override
    public List<RestaurantContactResponse> getRestaurantsContact(List<Long> restaurantIds) {
        return this.restaurantRepository.findAllById(restaurantIds)
                .stream()
                .map(this.restaurantMapper::mapToRestaurantContactResponse)
                .toList();
    }

    @Override
    public void restaurantExists(Long id) {
        this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));
    }
}