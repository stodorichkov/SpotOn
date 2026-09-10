package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record RestaurantWorkingHoursRequest(
        @NotEmpty(message = MessageConstants.BLANK_FIELD)
        @Valid
        List<WorkingHoursEntryRequest> workingHours
) {
}
