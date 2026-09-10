package com.example.auth.specification;

import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.filter.EmployeeSearchFilter;
import com.example.auth.model.payload.filter.UserFilter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.List;

public class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<User> fromFilter(UserFilter filter) {
        Specification<User> specification = Specification.unrestricted();

        if (filter.id() != null) {
            specification = specification.and(hasId(filter.id()));
        }

        if (StringUtils.hasText(filter.email())) {
            specification = specification.and(hasEmailContaining(filter.email()));
        }

        if (filter.roles() != null && !filter.roles().isEmpty()) {
            specification = specification.and(hasRoles(filter.roles()));
        }

        if (filter.isActive() != null) {
            specification = specification.and(hasIsActive(filter.isActive()));
        }

        return specification;
    }

    public static Specification<User> fromFilter(Specification<User> base, EmployeeSearchFilter filter) {
        var specification = base.and(isNotDeleted());

        if (StringUtils.hasText(filter.email())) {
            specification = specification.and(hasEmailContaining(filter.email()));
        }

        if (StringUtils.hasText(filter.name())) {
            specification = specification.and(hasNameContaining(filter.name()));
        }

        if (StringUtils.hasText(filter.phoneNumber())) {
            specification = specification.and(hasPhoneNumberContaining(filter.phoneNumber()));
        }

        if (filter.roles() != null && !filter.roles().isEmpty()) {
            specification = specification.and(hasRoles(filter.roles()));
        }

        return specification;
    }

    public static Specification<User> hasId(Long id) {
        return (root, query, cb) -> cb.equal(root.get("id"), id);
    }

    public static Specification<User> hasEmailContaining(String email) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<User> hasRoles(List<RoleEnum> roles) {
        return (root, query, cb) -> root.get("role").get("name").in(roles);
    }

    public static Specification<User> hasIdIn(List<Long> ids) {
        return (root, query, cb) -> root.get("id").in(ids);
    }

    public static Specification<User> hasNameContaining(String name) {
        return (root, query, cb) -> {
            final var pattern = "%" + name.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern)
            );
        };
    }

    public static Specification<User> hasPhoneNumberContaining(String phoneNumber) {
        return (root, query, cb) ->
                cb.like(root.get("phoneNumber"), "%" + phoneNumber + "%");
    }

    public static Specification<User> isNotDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }

    public static Specification<User> hasIsActive(Boolean isActive) {
        return (root, query, cb) -> isActive
                ? cb.isNull(root.get("deletedAt"))
                : cb.isNotNull(root.get("deletedAt"));
    }
}
