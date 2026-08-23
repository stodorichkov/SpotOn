package com.example.booking.service;

import com.example.booking.client.RestaurantBookingClient;
import com.example.booking.client.AuthBookingClient;
import com.example.booking.constants.MessageConstants;
import com.example.booking.exception.AccessDeniedException;
import com.example.booking.exception.BadRequestException;
import com.example.booking.mapper.BookingMapper;
import com.example.booking.model.entity.Booking;
import com.example.booking.model.enums.StatuEnum;
import com.example.booking.model.enums.RoleEnum;
import com.example.booking.model.payload.request.BookingClientRequest;
import com.example.booking.model.payload.request.BookingConfirmRequest;
import com.example.booking.model.payload.response.ClientContactResponse;
import com.example.booking.model.payload.response.RestaurantContactResponse;
import com.example.booking.model.payload.response.BookingClientResponse;
import com.example.booking.model.payload.response.BookingEmployeeResponse;
import com.example.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
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
    private final AuthBookingClient authBookingClient;

    @Override
    @Transactional
    public BookingClientResponse addBooking(BookingClientRequest request, Long clientId) {
        final var restaurantId = request.restaurantId();

        this.restaurantBookingClient.restaurantExists(restaurantId);

        final var status = this.statusService.getStatusByName(StatuEnum.PENDING);

        final var booking = this.bookingMapper.mapFormClientBookingRequest(request);
        booking.setClientId(clientId);
        booking.setStatus(status);

        final var savedBooking = this.bookingRepository.save(booking);

        final var restaurantContact = this.restaurantBookingClient.getRestaurantsContact(List.of(restaurantId))
                .stream()
                .findFirst()
                .orElse(null);

        return this.bookingMapper.mapToClientBookingResponse(savedBooking, restaurantContact);
    }

    @Override
    @Transactional
    public Page<BookingClientResponse> getClientBookings(Long clientId, Pageable pageable) {
        final var bookingsPage = this.bookingRepository.findAllByClientId(clientId, pageable);
        final var restaurantIds = bookingsPage.getContent().stream()
                .map(Booking::getRestaurantId)
                .toList();

        final var restaurantsById = this.restaurantBookingClient.getRestaurantsContact(restaurantIds)
                .stream()
                .collect(Collectors.toMap(RestaurantContactResponse::id, Function.identity()));

        final var clientBookingResponses = bookingsPage.getContent().stream()
                .map(booking -> {
                    final var restaurant = restaurantsById.get(booking.getRestaurantId());
                    return this.bookingMapper.mapToClientBookingResponse(booking, restaurant);
                })
                .toList();

        return new PageImpl<>(clientBookingResponses, pageable, bookingsPage.getTotalElements());
    }

    @Override
    @Transactional
    public Page<BookingEmployeeResponse> getRestaurantBookings(Long restaurantId, Pageable pageable) {
        final var bookingsPage = this.bookingRepository.findAllByRestaurantId(restaurantId, pageable);
        final var userIds = bookingsPage.getContent().stream()
                .map(Booking::getClientId)
                .toList();

        final var usersById = this.authBookingClient.getUsers(userIds)
                .stream()
                .collect(Collectors.toMap(ClientContactResponse::id, Function.identity()));

        final var restaurantBookingResponses = bookingsPage.getContent().stream()
                .map(booking -> {
                    final var client = usersById.get(booking.getClientId());
                    return this.bookingMapper.mapToRestaurantBookingResponse(booking, client);
                })
                .toList();

        return new PageImpl<>(restaurantBookingResponses, pageable, bookingsPage.getTotalElements());
    }

    @Override
    @Transactional
    public void markBookingAsConfirmed(Long bookingId, Long restaurantId, BookingConfirmRequest request) {
        final var booking = this.bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BadRequestException(MessageConstants.BOOKING_NOT_FOUND));

        if (
                !booking.getRestaurantId().equals(restaurantId)
                || !booking.getStatus().getName().equals(StatuEnum.PENDING)
        ) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        this.restaurantBookingClient.validateRestaurantTable(request);

        final var twoHoursBefore = booking.getDateTime().minus(2, ChronoUnit.HOURS);
        final var conflictingBookings = this.bookingRepository.findAllByTableIdAndDateTimeBetween(
                request.tableId(),
                twoHoursBefore,
                booking.getDateTime()
        );

        final var busyStatuses = List.of(StatuEnum.CONFIRMED, StatuEnum.ARRIVED);
        conflictingBookings.stream()
                .filter(b -> busyStatuses.contains(b.getStatus().getName()))
                .findAny()
                .ifPresent(b -> {
                    throw new BadRequestException(MessageConstants.TABLE_ALREADY_BOOKED);
                });

        final var status = this.statusService.getStatusByName(StatuEnum.CONFIRMED);

        booking.setStatus(status);
        booking.setTableId(request.tableId());

        this.bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void markBookingAsArrived(Long bookingId, Long restaurantId) {
        final var booking = this.bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BadRequestException(MessageConstants.BOOKING_NOT_FOUND));

        if (
                !booking.getRestaurantId().equals(restaurantId)
                || !booking.getStatus().getName().equals(StatuEnum.CONFIRMED)
        ) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        final var status = this.statusService.getStatusByName(StatuEnum.ARRIVED);

        booking.setStatus(status);

        this.bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void markBookingAsCompleted(Long bookingId, Long restaurantId) {
        final var booking = this.bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BadRequestException(MessageConstants.BOOKING_NOT_FOUND));

        if (
                !booking.getRestaurantId().equals(restaurantId)
                || !booking.getStatus().getName().equals(StatuEnum.ARRIVED)
        ) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        final var status = this.statusService.getStatusByName(StatuEnum.COMPLETED);

        booking.setStatus(status);

        this.bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void markBookingAsCanceled(Long bookingId, RoleEnum role, Long id) {
        final var booking = this.bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BadRequestException(MessageConstants.BOOKING_NOT_FOUND));

        final var currentStatus = booking.getStatus().getName();
        if (currentStatus != StatuEnum.PENDING && currentStatus != StatuEnum.CONFIRMED) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        if (role == RoleEnum.CLIENT) {
            if (!booking.getClientId().equals(id)) {
                throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
            }
        } else if (role == RoleEnum.EMPLOYEE) {
            if (!booking.getRestaurantId().equals(id)) {
                throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
            }
        } else {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        final var status = this.statusService.getStatusByName(StatuEnum.CANCELED);

        booking.setStatus(status);

        this.bookingRepository.save(booking);
    }
}