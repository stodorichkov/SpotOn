package com.example.restaurant.model.payload.request;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.constants.RegexConstants;
import com.example.restaurant.model.enums.CategoryEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.Set;

public record RestaurantRequest(
        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String name,

        @NotBlank(message = MessageConstants.BLANK_FIELD)
        String address,

        @Pattern(regexp = RegexConstants.PHONE_NUMBER_REGEX, message = MessageConstants.INVALID_PHONE_NUMBER)
        String phoneNumber,

        @NotEmpty(message = MessageConstants.NO_CATEGORY)
        Set<CategoryEnum> categories
) {
}
