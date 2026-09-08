package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.BadRequestException;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.CategoryMapper;
import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.payload.filter.CategoryFilter;
import com.example.restaurant.model.payload.request.CategoryActiveStatusRequest;
import com.example.restaurant.model.payload.request.CategoryRequest;
import com.example.restaurant.model.payload.response.CategoryResponse;
import com.example.restaurant.repository.CategoryRepository;
import com.example.restaurant.specification.CategorySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    private static final List<String[]> DEFAULT_CATEGORIES = List.of(
            new String[]{"Fine Dining", "Изискана кухня"},
            new String[]{"Casual", "Небрежен стил"},
            new String[]{"Fast Food", "Бързо хранене"},
            new String[]{"Cafe", "Кафене"},
            new String[]{"Bar", "Бар"},
            new String[]{"Pizzeria", "Пицария"},
            new String[]{"Sushi", "Суши"},
            new String[]{"Night Club", "Нощен клуб"}
    );

    @Override
    @Transactional
    public void saveAllCategories() {
        DEFAULT_CATEGORIES.stream()
                .filter(names -> this.categoryRepository.findByNameEnAndDeletedAtIsNull(names[0]).isEmpty())
                .forEach(names -> {
                    final var category = new Category();
                    category.setNameEn(names[0]);
                    category.setNameBg(names[1]);
                    this.categoryRepository.saveAndFlush(category);
                    System.out.println(MessageConstants.ADD_CATEGORY + category.getNameEn());
                });
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return this.categoryRepository.findAll(CategorySpecification.isNotDeleted())
                .stream()
                .map(this.categoryMapper::mapToCategoryResponse)
                .toList();
    }

    @Override
    public Page<CategoryResponse> getCategories(CategoryFilter filter, Pageable pageable) {
        final var specification = CategorySpecification.fromFilter(filter);

        return this.categoryRepository.findAll(specification, pageable)
                .map(this.categoryMapper::mapToCategoryResponse);
    }

    @Override
    public CategoryResponse getCategory(Long id) {
        return this.categoryRepository.findById(id)
                .map(this.categoryMapper::mapToCategoryResponse)
                .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND));
    }

    @Override
    @Transactional
    public CategoryResponse addCategory(CategoryRequest request) {
        final var nameEn = request.nameEn().trim();
        final var nameBg = request.nameBg().trim();

        this.assertNamesNotTaken(nameEn, nameBg, null);

        final var category = new Category();
        category.setNameEn(nameEn);
        category.setNameBg(nameBg);

        final var savedCategory = this.categoryRepository.save(category);

        return this.categoryMapper.mapToCategoryResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse editCategory(Long id, CategoryRequest request) {
        final var category = this.categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND));

        final var nameEn = request.nameEn().trim();
        final var nameBg = request.nameBg().trim();

        this.assertNamesNotTaken(nameEn, nameBg, id);

        category.setNameEn(nameEn);
        category.setNameBg(nameBg);
        this.categoryRepository.save(category);

        return this.categoryMapper.mapToCategoryResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategoryActiveStatus(Long id, CategoryActiveStatusRequest request) {
        final var category = this.categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND));

        if (request.isActive()) {
            this.assertNamesNotTaken(category.getNameEn(), category.getNameBg(), id);
        }

        category.setDeletedAt(request.isActive() ? null : Instant.now());
        this.categoryRepository.save(category);

        return this.categoryMapper.mapToCategoryResponse(category);
    }

    private void assertNamesNotTaken(String nameEn, String nameBg, Long excludingId) {
        this.categoryRepository.findByNameEnAndDeletedAtIsNull(nameEn)
                .filter(existing -> excludingId == null || !existing.getId().equals(excludingId))
                .ifPresent(existing -> {
                    throw new BadRequestException(MessageConstants.CATEGORY_EXISTS);
                });

        this.categoryRepository.findByNameBgAndDeletedAtIsNull(nameBg)
                .filter(existing -> excludingId == null || !existing.getId().equals(excludingId))
                .ifPresent(existing -> {
                    throw new BadRequestException(MessageConstants.CATEGORY_EXISTS);
                });
    }
}
