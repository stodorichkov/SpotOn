package com.example.restaurant.specification;

import com.example.restaurant.model.enity.Restaurant;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class RestaurantSpecification {

    private RestaurantSpecification() {
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
}
