package com.example.auth.specification;

import com.example.auth.model.entity.User;
import com.example.auth.model.enums.RoleEnum;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class UserSpecification {

    private UserSpecification() {
    }

    public static Specification<User> hasUsernameContaining(String username) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("username")), "%" + username.toLowerCase() + "%");
    }

    public static Specification<User> hasRoles(List<RoleEnum> roles) {
        return (root, query, cb) -> root.get("role").get("name").in(roles);
    }
}
