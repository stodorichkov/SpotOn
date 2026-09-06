package com.example.booking.specification;

import com.example.booking.model.entity.Booking;
import com.example.booking.model.enums.StatuEnum;
import com.example.booking.model.payload.filter.BookingFilter;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

public class BookingSpecification {

    private BookingSpecification() {
    }

    public static Specification<Booking> fromFilter(Specification<Booking> base, BookingFilter filter) {
        var specification = base;

        if (filter.id() != null) {
            specification = specification.and(hasId(filter.id()));
        }

        if (filter.statuses() != null && !filter.statuses().isEmpty()) {
            specification = specification.and(hasStatuses(filter.statuses()));
        }

        if (filter.from() != null) {
            final var fromInstant = filter.from().atStartOfDay(ZoneId.systemDefault()).toInstant();
            specification = specification.and(hasDateTimeFrom(fromInstant));
        }

        if (filter.to() != null) {
            final var toInstant = filter.to().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
            specification = specification.and(hasDateTimeTo(toInstant));
        }

        return specification;
    }

    public static Specification<Booking> hasId(Long id) {
        return (root, query, cb) -> cb.equal(root.get("id"), id);
    }

    public static Specification<Booking> hasClientId(Long clientId) {
        return (root, query, cb) -> cb.equal(root.get("clientId"), clientId);
    }

    public static Specification<Booking> hasRestaurantId(Long restaurantId) {
        return (root, query, cb) -> cb.equal(root.get("restaurantId"), restaurantId);
    }

    public static Specification<Booking> hasRestaurantIdIn(List<Long> restaurantIds) {
        return (root, query, cb) -> root.get("restaurantId").in(restaurantIds);
    }

    public static Specification<Booking> hasClientIdIn(List<Long> clientIds) {
        return (root, query, cb) -> root.get("clientId").in(clientIds);
    }

    public static Specification<Booking> hasStatuses(List<StatuEnum> statuses) {
        return (root, query, cb) -> root.get("status").get("name").in(statuses);
    }

    public static Specification<Booking> hasDateTimeFrom(Instant from) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dateTime"), from);
    }

    public static Specification<Booking> hasDateTimeTo(Instant to) {
        return (root, query, cb) -> cb.lessThan(root.get("dateTime"), to);
    }
}
