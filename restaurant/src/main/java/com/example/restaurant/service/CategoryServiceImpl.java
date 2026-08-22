package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.payload.response.CategoryResponse;
import com.example.restaurant.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Fine Dining",
            "Casual",
            "Fast Food",
            "Cafe",
            "Bar",
            "Pizzeria",
            "Sushi",
            "Night Club"
    );

    @Override
    @Transactional
    public void saveAllCategories() {
        DEFAULT_CATEGORIES.stream()
                .filter(name -> this.categoryRepository.findByName(name).isEmpty())
                .forEach(name -> {
                    final var category = new Category();
                    category.setName(name);
                    this.categoryRepository.saveAndFlush(category);
                    System.out.println(MessageConstants.ADD_CATEGORY + category.getName());
                });
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return this.categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .toList();
    }
}
