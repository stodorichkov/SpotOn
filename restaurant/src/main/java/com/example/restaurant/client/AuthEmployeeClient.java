package com.example.restaurant.client;

import com.example.restaurant.model.enums.RoleEnum;
import com.example.restaurant.model.payload.response.UserDetailsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "auth",
        path = "/employees"
)
public interface AuthEmployeeClient {
    @PostMapping
    List<UserDetailsResponse> getEmployees(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) List<RoleEnum> roles,
            @RequestParam(required = false) String sort,
            @RequestBody List<Long> userIds
    );

    @DeleteMapping("/{id}")
    void removeEmployee(@PathVariable Long id);
}
