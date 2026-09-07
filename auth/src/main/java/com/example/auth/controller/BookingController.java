package com.example.auth.controller;

import com.example.auth.constants.HeaderConstants;
import com.example.auth.model.payload.response.ClientContactResponse;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.model.enums.ServiceEnum;
import com.example.auth.service.AuthorizationService;
import com.example.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("bookings")
@RequiredArgsConstructor
public class BookingController {
    private final UserService userService;
    private final AuthorizationService authorizationService;

    @PostMapping("/users")
    public List<ClientContactResponse> getClientsContact(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String serviceSecret,
            @RequestBody List<Long> userIds
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.ADMIN, RoleEnum.MANAGER ,RoleEnum.EMPLOYEE);
        this.authorizationService.hasInternalAccess(serviceSecret, service, ServiceEnum.BOOKING);

        return userService.getClientContacts(userIds);
    }

    @GetMapping("/users/search")
    public List<Long> searchClientIds(
            @RequestHeader(HeaderConstants.USER_ROLE) RoleEnum userRoleHeader,
            @RequestHeader(HeaderConstants.ITERNAL_SERVICE) ServiceEnum service,
            @RequestHeader(HeaderConstants.ITERNAL_SECRET) String serviceSecret,
            @RequestParam String name
    ) {
        this.authorizationService.hasRole(userRoleHeader, RoleEnum.EMPLOYEE);
        this.authorizationService.hasInternalAccess(serviceSecret, service, ServiceEnum.BOOKING);

        return userService.searchClientIds(name);
    }
}
