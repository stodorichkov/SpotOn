package com.example.booking.client;

import com.example.booking.model.payload.response.BookingRestaurantResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(
        name = "restaurant",
        path = "/bookings"
)
public interface RestaurantBookingClient {
    @PostMapping("/restaurants")
    List<BookingRestaurantResponse> getRestaurants(@RequestBody List<Long> restaurantIds);
}
