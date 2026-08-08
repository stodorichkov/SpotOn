package com.example.booking.mapper;

import com.example.booking.model.entity.Booking;
import com.example.booking.model.payload.request.ClientBookingRequest;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingRestaurantResponse;
import com.example.booking.model.payload.response.ClientBookingResponse;
import com.example.booking.model.payload.response.RestaurantBookingResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BookingMapper {
    Booking mapFormClientBookingRequest(ClientBookingRequest request);

    @Mapping(source = "booking.id", target = "id")
    @Mapping(source = "booking.status.name", target = "status")
    @Mapping(source = "restaurant", target = "restaurant")
    ClientBookingResponse mapToClientBookingResponse(Booking booking, BookingRestaurantResponse restaurant);

    @Mapping(source = "booking.id", target = "id")
    @Mapping(source = "booking.status.name", target = "status")
    @Mapping(source = "client", target = "client")
    RestaurantBookingResponse mapToRestaurantBookingResponse(Booking booking, BookingClientResponse client);
}