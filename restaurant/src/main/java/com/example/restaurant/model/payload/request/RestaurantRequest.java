package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.constants.RegexConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.Set;

public record RestaurantRequest(
        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String name,

        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String address,

        @Pattern(regexp = RegexConstants.PHONE_NUMBER_REGEX, message = MessageConstants.INVALID_PHONE_NUMBER)
        String phoneNumber,

        Set<Long> categories
) {
}
