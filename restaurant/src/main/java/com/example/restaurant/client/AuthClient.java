package com.example.restaurant.client;

import com.example.restaurant.model.payload.response.UserDetailsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient("auth")
public interface AuthClient {
    @PostMapping("/users/employees")
    List<UserDetailsResponse> getEmployees(@RequestBody List<Long> userIds);
}
