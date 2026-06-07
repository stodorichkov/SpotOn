package com.example.auth.client;

import com.example.auth.model.payload.request.AddEmployeeRequest;
import com.example.auth.model.payload.request.AddManagerRequest;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("restaurant")
public interface RestaurantClient {
    @PostMapping("/employees/employee")
    void addEmployee(@Valid @RequestBody AddEmployeeRequest request);

    @PostMapping("/employees/manager")
    void addManager(@Valid @RequestBody AddManagerRequest request);

    @GetMapping("/employees/{id}/restaurant")
    Long getRestaurantByEmployeeId(@PathVariable Long id);
}
