package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.mapper.category.CategoryMapper;
import com.example.restaurant.model.enums.CategoryEnum;
import com.example.restaurant.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public void saveAllCategories() {
        Arrays.stream(CategoryEnum.values())
                .filter(name -> this.categoryRepository.findByName(name).isEmpty())
                .map(this.categoryMapper::map)
                .forEach(category -> {
                    this.categoryRepository.saveAndFlush(category);
                    System.out.println(MessageConstants.ADD_CATEGORY + category.getName());
                });
    }
}
