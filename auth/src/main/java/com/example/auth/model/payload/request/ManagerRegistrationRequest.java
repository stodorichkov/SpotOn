package com.example.auth.model.payload.request;

import com.example.auth.constants.MessageConstants;
import jakarta.validation.constraints.NotNull;

public record ManagerRegistrationRequest(
        EmployeeRegistrationRequest employeeData,

        @NotNull(message = MessageConstants.BLANK_FIELD)
        Long restaurantId
) {
}
