package com.example.restaurant.service;

import com.example.restaurant.model.payload.filter.CategoryFilter;
import com.example.restaurant.model.payload.request.CategoryActiveStatusRequest;
import com.example.restaurant.model.payload.request.CategoryRequest;
import com.example.restaurant.model.payload.response.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    void saveAllCategories();
    List<CategoryResponse> getAllCategories();
    Page<CategoryResponse> getCategories(CategoryFilter filter, Pageable pageable);
    CategoryResponse getCategory(Long id);
    CategoryResponse addCategory(CategoryRequest request);
    CategoryResponse editCategory(Long id, CategoryRequest request);
    CategoryResponse updateCategoryActiveStatus(Long id, CategoryActiveStatusRequest request);
}
