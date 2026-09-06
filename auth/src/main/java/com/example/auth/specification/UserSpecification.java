package com.example.auth.specification;

import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class UserSpecification {

    private UserSpecification() {
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
}
