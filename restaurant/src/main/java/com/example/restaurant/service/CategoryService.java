package com.example.restaurant.service;

import com.example.restaurant.model.payload.response.CategoryResponse;
import java.util.List;

public interface CategoryService {
    void saveAllCategories();
    List<CategoryResponse> getAllCategories();
}
