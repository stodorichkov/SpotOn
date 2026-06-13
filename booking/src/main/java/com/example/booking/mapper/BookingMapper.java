package com.example.booking.mapper;

import com.example.booking.model.entity.Booking;
import com.example.booking.model.payload.request.ClientBookingRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BookingMapper {
    Booking mapFormClientBookingRequest(ClientBookingRequest request);
}
