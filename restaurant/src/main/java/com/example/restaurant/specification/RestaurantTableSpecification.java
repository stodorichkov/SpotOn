package com.example.restaurant.specification;

import com.example.restaurant.model.enity.RestaurantTable;
import org.springframework.data.jpa.domain.Specification;

public class RestaurantTableSpecification {

    private RestaurantTableSpecification() {
    }

    public static Specification<RestaurantTable> hasRestaurantId(Long restaurantId) {
        return (root, query, cb) -> cb.equal(root.get("restaurant").get("id"), restaurantId);
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
