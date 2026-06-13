package com.example.booking.service;

import com.example.booking.model.entity.Status;
import com.example.booking.model.enums.StatuEnum;

public interface StatusService {
    void saveAllStatuses();
    Status getStatusByName(StatuEnum name);
}
