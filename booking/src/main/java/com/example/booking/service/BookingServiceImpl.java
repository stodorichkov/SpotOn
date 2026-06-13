package com.example.booking.service;

import com.example.booking.mapper.BookingMapper;
import com.example.booking.model.enums.StatuEnum;
import com.example.booking.model.payload.request.ClientBookingRequest;
import com.example.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final StatusService statusService;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    @Override
    public void addBooking(ClientBookingRequest request, Long clientId) {
        final var status = this.statusService.getStatusByName(StatuEnum.PENDING);

        final var booking = this.bookingMapper.mapFormClientBookingRequest(request);
        booking.setClientId(clientId);
        booking.setStatus(status);

        this.bookingRepository.save(booking);
    }
}
