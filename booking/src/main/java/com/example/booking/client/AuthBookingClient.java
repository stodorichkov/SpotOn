package com.example.booking.client;

import com.example.booking.model.payload.response.ClientContactResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(
        name = "auth",
        path = "/bookings"
)
public interface AuthBookingClient {
    @PostMapping("/users")
    List<ClientContactResponse> getUsers(@RequestBody List<Long> userIds);
}