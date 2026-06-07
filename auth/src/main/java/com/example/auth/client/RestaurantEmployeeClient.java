package com.example.auth.client;

import com.example.auth.model.payload.request.AddEmployeeRequest;
import com.example.auth.model.payload.request.AddManagerRequest;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "restaurant",
        path = "/employees"
)
public interface RestaurantEmployeeClient {
    @PostMapping("/employee")
    void addEmployee(@Valid @RequestBody AddEmployeeRequest request);

    @PostMapping("/manager")
    void addManager(@Valid @RequestBody AddManagerRequest request);

    @GetMapping("/{id}/restaurant")
    Long getRestaurantId(@PathVariable Long id);
}
