package com.example.booking.client;

import com.example.booking.model.payload.request.BookingConfirmRequest;
import com.example.booking.model.payload.request.RestaurantTableValidationRequest;
import com.example.booking.model.payload.request.RestaurantWorkingHoursValidationRequest;
import com.example.booking.model.payload.response.RestaurantContactResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "restaurant",
        path = "/bookings"
)
public interface RestaurantBookingClient {
    @PostMapping("/restaurants")
    List<RestaurantContactResponse> getRestaurantsContact(@RequestBody List<Long> restaurantIds);

    @GetMapping("/restaurants/{restaurantId}/exists")
    void restaurantExists(@PathVariable Long restaurantId);

    @GetMapping("/restaurants/search")
    List<Long> searchRestaurantIds(@RequestParam String name);

    @PostMapping("/table/validation")
    Integer validateRestaurantTable(@RequestBody RestaurantTableValidationRequest request);

    @PostMapping("/working-hours/validation")
    void validateWorkingHours(@RequestBody RestaurantWorkingHoursValidationRequest request);
}