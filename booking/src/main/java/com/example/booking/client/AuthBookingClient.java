package com.example.booking.client;

import com.example.booking.model.payload.response.ClientContactResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "auth",
        path = "/bookings"
)
public interface AuthBookingClient {
    @PostMapping("/users")
    List<ClientContactResponse> getUsers(@RequestBody List<Long> userIds);

    @GetMapping("/users/search")
    List<Long> searchClientIds(@RequestParam String name);
}