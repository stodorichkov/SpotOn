package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.category.CategoryMapper;
import com.example.restaurant.mapper.category.RestaurantMapper;
import com.example.restaurant.model.enums.CategoryEnum;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.repository.CategoryRepository;
import com.example.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantMapper restaurantMapper;

    @Override
    public void addRestaurant(RestaurantRequest request) {
        final var restaurant = this.restaurantMapper.map(request);

        final var categories = request.categories()
                .stream()
                .map(name -> {
                    final var categoryEnum = CategoryEnum.valueOf(name);

                    return this.categoryRepository.findByName(categoryEnum)
                            .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND));
                })
                .collect(Collectors.toSet());

        restaurant.setCategories(categories);

        this.restaurantRepository.save(restaurant);
    }
}
