package com.example.restaurant.mapper;

import com.example.restaurant.model.enity.Employee;
import com.example.restaurant.model.payload.request.AddEmployeeRequest;
import com.example.restaurant.model.payload.request.AddManagerRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface EmployeeMapper {
    Employee mapFromAddEmployeeRequest(AddEmployeeRequest request);

    Employee mapFromAddManagerRequest(AddManagerRequest request);
}
