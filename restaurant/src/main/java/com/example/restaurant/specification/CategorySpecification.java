package com.example.restaurant.specification;

import com.example.restaurant.model.enity.Category;
import com.example.restaurant.model.payload.filter.CategoryFilter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class CategorySpecification {

    private CategorySpecification() {
    }

    public static Specification<Category> fromFilter(CategoryFilter filter) {
        Specification<Category> specification = Specification.unrestricted();

        if (filter.id() != null) {
            specification = specification.and(hasId(filter.id()));
        }

        if (StringUtils.hasText(filter.name())) {
            specification = specification.and(hasNameContaining(filter.name()));
        }

        if (filter.isActive() != null) {
            specification = specification.and(hasIsActive(filter.isActive()));
        }

        return specification;
    }

    public static Specification<Category> hasId(Long id) {
        return (root, query, cb) -> cb.equal(root.get("id"), id);
    }

    public static Specification<Category> hasNameContaining(String name) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Category> hasIsActive(Boolean isActive) {
        return (root, query, cb) -> isActive
                ? cb.isNull(root.get("deletedAt"))
                : cb.isNotNull(root.get("deletedAt"));
    }

    public static Specification<Category> isNotDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }
}
