package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.RestaurantMapper;
import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.response.RestaurantContactResponse;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import com.example.restaurant.repository.CategoryRepository;
import com.example.restaurant.repository.RestaurantRepository;
import com.example.restaurant.specification.RestaurantSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
    public RestaurantResponse addRestaurant(RestaurantRequest request) {
        final var restaurant = this.restaurantMapper.mapFromRestaurantRequest(request);

        final var categories = request.categories()
                .stream()
                .map(id -> this.categoryRepository.findById(id)
                        .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND))
                )
                .collect(Collectors.toSet());

        restaurant.setCategories(categories);

        final var savedRestaurant = this.restaurantRepository.save(restaurant);

        return this.restaurantMapper.mapToRestaurantResponse(savedRestaurant);
    }

    @Override
    public Page<RestaurantResponse> getRestaurants(String name, String address, List<Long> categoryIds, Pageable pageable) {
        Specification<Restaurant> specification = Specification.unrestricted();

        if (StringUtils.hasText(name)) {
            specification = specification.and(RestaurantSpecification.hasNameContaining(name));
        }

        if (StringUtils.hasText(address)) {
            specification = specification.and(RestaurantSpecification.hasAddressContaining(address));
        }

        if (categoryIds != null && !categoryIds.isEmpty()) {
            specification = specification.and(RestaurantSpecification.hasCategoryIds(categoryIds));
        }

        return this.restaurantRepository.findAll(specification, pageable)
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
                .map(catId -> this.categoryRepository.findById(catId)
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