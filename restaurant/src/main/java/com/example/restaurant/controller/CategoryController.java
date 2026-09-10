package com.example.restaurant.controller;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.payload.filter.CategoryFilter;
import com.example.restaurant.model.payload.request.CategoryActiveStatusRequest;
import com.example.restaurant.model.payload.request.CategoryRequest;
import com.example.restaurant.model.payload.response.CategoryResponse;
import com.example.restaurant.service.AuthorizationService;
import com.example.restaurant.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final AuthorizationService authorizationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CategoryResponse> getCategories() {
        return this.categoryService.getAllCategories();
    }

    @GetMapping("/manage")
    @ResponseStatus(HttpStatus.OK)
    public Page<CategoryResponse> getCategoriesPage(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            CategoryFilter filter,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.categoryService.getCategories(filter, pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CategoryResponse getCategory(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @PathVariable Long id
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.categoryService.getCategory(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @Valid @RequestBody CategoryRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.categoryService.addCategory(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CategoryResponse editCategory(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.categoryService.editCategory(id, request);
    }

    @PatchMapping("/{id}/active")
    @ResponseStatus(HttpStatus.OK)
    public CategoryResponse updateCategoryActiveStatus(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @PathVariable Long id,
            @Valid @RequestBody CategoryActiveStatusRequest request
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.categoryService.updateCategoryActiveStatus(id, request);
    }
}
