package com.example.booking.mapper;

import com.example.booking.model.entity.Booking;
import com.example.booking.model.entity.BookingStatusHistory;
import com.example.booking.model.payload.request.BookingClientRequest;
import com.example.booking.model.payload.response.ClientContactResponse;
import com.example.booking.model.payload.response.RestaurantContactResponse;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import com.example.booking.model.payload.response.BookingStatusHistoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BookingMapper {
    @Mapping(source = "isSmoking", target = "isSmoking")
    Booking mapFormClientBookingRequest(BookingClientRequest request);

    @Mapping(source = "booking.id", target = "id")
    @Mapping(source = "booking.status.name", target = "status")
    @Mapping(source = "restaurant", target = "restaurant")
    @Mapping(source = "booking.isSmoking", target = "isSmoking")
    BookingClientResponse mapToClientBookingResponse(Booking booking, RestaurantContactResponse restaurant);

    @Mapping(source = "booking.id", target = "id")
    @Mapping(source = "booking.status.name", target = "status")
    @Mapping(source = "client", target = "client")
    @Mapping(source = "booking.isSmoking", target = "isSmoking")
    BookingEmployeeResponse mapToRestaurantBookingResponse(Booking booking, ClientContactResponse client);

    @Mapping(source = "history.id", target = "id")
    @Mapping(source = "history.status.name", target = "status")
    @Mapping(source = "history.changedAt", target = "changedAt")
    @Mapping(source = "history.changedByUserId", target = "changedByUserId")
    @Mapping(source = "user.firstName", target = "changedByFirstName")
    @Mapping(source = "user.lastName", target = "changedByLastName")
    @Mapping(source = "user.role", target = "changedByRole")
    BookingStatusHistoryResponse mapToBookingStatusHistoryResponse(BookingStatusHistory history, ClientContactResponse user);
}