package com.example.restaurant.specification;

import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.payload.filter.RestaurantFilter;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.List;

public class RestaurantSpecification {

    private RestaurantSpecification() {
    }

    public static Specification<Restaurant> fromFilter(RestaurantFilter filter) {
        Specification<Restaurant> specification = Specification.unrestricted();

        if (filter.id() != null) {
            specification = specification.and(hasId(filter.id()));
        }

        if (StringUtils.hasText(filter.name())) {
            specification = specification.and(hasNameContaining(filter.name()));
        }

        if (StringUtils.hasText(filter.address())) {
            specification = specification.and(hasAddressContaining(filter.address()));
        }

        if (filter.categoryIds() != null && !filter.categoryIds().isEmpty()) {
            specification = specification.and(hasCategoryIds(filter.categoryIds()));
        }

        if (filter.isOpen() != null) {
            specification = specification.and(hasIsOpen(filter.isOpen()));
        }

        if (filter.isActive() != null) {
            specification = specification.and(hasIsActive(filter.isActive()));
        }

        return specification;
    }

    public static Specification<Restaurant> hasId(Long id) {
        return (root, query, cb) -> cb.equal(root.get("id"), id);
    }

    public static Specification<Restaurant> hasNameContaining(String name) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Restaurant> hasAddressContaining(String address) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("address")), "%" + address.toLowerCase() + "%");
    }

    public static Specification<Restaurant> hasCategoryIds(List<Long> categoryIds) {
        return (root, query, cb) -> {
            query.distinct(true);

            return root.join("categories", JoinType.LEFT).get("id").in(categoryIds);
        };
    }

    public static Specification<Restaurant> hasIsOpen(Boolean isOpen) {
        return (root, query, cb) -> cb.equal(root.get("isOpen"), isOpen);
    }

    public static Specification<Restaurant> hasIsActive(Boolean isActive) {
        return (root, query, cb) -> isActive
                ? cb.isNull(root.get("deletedAt"))
                : cb.isNotNull(root.get("deletedAt"));
    }
}
