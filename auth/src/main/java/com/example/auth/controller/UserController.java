package com.example.auth.controller;

import com.example.auth.constants.HeaderConstants;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.payload.response.UserDetailsResponse;
import com.example.auth.model.payload.response.UserResponse;
import com.example.auth.service.AuthorizationService;
import com.example.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthorizationService authorizationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<UserResponse> getUsers(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            Pageable pageable
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.userService.getUsers(pageable);
    }

    @GetMapping("/user/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserDetailsResponse getUser(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @PathVariable Long id
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN);

        return this.userService.getUser(id);
    }

    @DeleteMapping("/employee/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void removeEmployee(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @PathVariable Long id
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.MANAGER);

        this.userService.removeEmployee(id);
    }
}
