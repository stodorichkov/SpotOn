package com.example.restaurant.client;

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
    List<UserDetailsResponse> getEmployees(@RequestBody List<Long> userIds);

    @DeleteMapping("/{id}")
    void removeEmployee(@PathVariable Long id);
}
