package com.example.restaurant.client;

import com.example.restaurant.model.payload.response.UserDetailsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient("auth")
public interface AuthClient {
    @PostMapping("/employees")
    List<UserDetailsResponse> getEmployees(@RequestBody List<Long> userIds);

    @DeleteMapping("/employees/{id}")
    void removeEmployee(@PathVariable Long id);
}
