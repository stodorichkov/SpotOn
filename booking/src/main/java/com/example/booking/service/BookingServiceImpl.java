package com.example.booking.service;

import com.example.booking.client.RestaurantBookingClient;
import com.example.booking.mapper.BookingMapper;
import com.example.booking.model.entity.Booking;
import com.example.booking.model.enums.StatuEnum;
import com.example.booking.model.payload.request.ClientBookingRequest;
import com.example.booking.model.payload.response.BookingRestaurantResponse;
import com.example.booking.model.payload.response.ClientBookingResponse;
import com.example.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final StatusService statusService;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final RestaurantBookingClient restaurantBookingClient;

    @Override
    public void addBooking(ClientBookingRequest request, Long clientId) {
        // Validate restaurant existence
        final var restaurantId = request.restaurantId();
        final var restaurants = this.restaurantBookingClient.getRestaurants(List.of(restaurantId));
        if (restaurants.isEmpty()) {
            throw new IllegalArgumentException("Restaurant with ID " + restaurantId + " not found.");
        }

        final var status = this.statusService.getStatusByName(StatuEnum.PENDING);

        final var booking = this.bookingMapper.mapFormClientBookingRequest(request);
        booking.setClientId(clientId);
        booking.setStatus(status);

        this.bookingRepository.save(booking);
    }

    @Override
    public Page<ClientBookingResponse> getClientBookings(Long clientId, Pageable pageable) {
        final var bookingsPage = this.bookingRepository.findAllByClientId(clientId, pageable);
        final var restaurantIds = bookingsPage.getContent().stream()
                .map(Booking::getRestaurantId)
                .toList();

        final var restaurantsById = this.restaurantBookingClient.getRestaurants(restaurantIds)
                .stream()
                .collect(Collectors.toMap(BookingRestaurantResponse::id, Function.identity()));

        final var clientBookingResponses = bookingsPage.getContent().stream()
                .map(booking -> {
                    final var restaurant = restaurantsById.get(booking.getRestaurantId());
                    return this.bookingMapper.mapToClientBookingResponse(booking, restaurant);
                })
                .toList();

        return new PageImpl<>(clientBookingResponses, pageable, bookingsPage.getTotalElements());
    }
}