package com.example.booking.model.payload.filter;

import com.example.booking.model.enums.StatuEnum;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public record BookingFilter(
        Long id,
        List<StatuEnum> statuses,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
) {
}
