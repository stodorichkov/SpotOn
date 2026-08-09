package com.example.booking.client;

import com.example.booking.model.payload.request.BookingConfirmRequest;
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

    @PostMapping("/table/validation")
    void validateRestaurantTable(@RequestBody BookingConfirmRequest request);
}