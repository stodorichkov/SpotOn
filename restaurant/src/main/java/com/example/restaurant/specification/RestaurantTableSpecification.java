package com.example.restaurant.specification;

import com.example.restaurant.model.enity.RestaurantTable;
import com.example.restaurant.model.payload.filter.TableFilter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class RestaurantTableSpecification {

    private RestaurantTableSpecification() {
    }

    public static Specification<RestaurantTable> fromFilter(Long restaurantId, TableFilter filter) {
        var specification = hasRestaurantId(restaurantId);

        if (filter.id() != null) {
            specification = specification.and(hasId(filter.id()));
        }

        if (StringUtils.hasText(filter.name())) {
            specification = specification.and(hasNameContaining(filter.name()));
        }

        if (filter.isSmokingAllowed() != null) {
            specification = specification.and(hasSmokingAllowed(filter.isSmokingAllowed()));
        }

        if (filter.minCapacity() != null) {
            specification = specification.and(hasCapacityAtLeast(filter.minCapacity()));
        }

        if (filter.maxCapacity() != null) {
            specification = specification.and(hasCapacityAtMost(filter.maxCapacity()));
        }

        return specification;
    }

    public static Specification<RestaurantTable> hasRestaurantId(Long restaurantId) {
        return (root, query, cb) -> cb.equal(root.get("restaurant").get("id"), restaurantId);
    }

    public static Specification<RestaurantTable> hasId(Long id) {
        return (root, query, cb) -> cb.equal(root.get("id"), id);
    }

    public static Specification<RestaurantTable> hasNameContaining(String name) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<RestaurantTable> hasSmokingAllowed(Boolean isSmokingAllowed) {
        return (root, query, cb) -> cb.equal(root.get("isSmokingAllowed"), isSmokingAllowed);
    }

    public static Specification<RestaurantTable> hasCapacityAtLeast(Integer minCapacity) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("capacity"), minCapacity);
    }

    public static Specification<RestaurantTable> hasCapacityAtMost(Integer maxCapacity) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("capacity"), maxCapacity);
    }
}
