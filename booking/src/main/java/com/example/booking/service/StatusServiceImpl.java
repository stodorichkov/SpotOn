package com.example.booking.service;

import com.example.booking.constants.MessageConstants;
import com.example.booking.exception.NotFoundException;
import com.example.booking.mapper.StatusMapper;
import com.example.booking.model.entity.Status;
import com.example.booking.model.enums.StatuEnum;
import com.example.booking.repository.StatusRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class StatusServiceImpl implements StatusService {
    private final StatusRepository statusRepository;
    private final StatusMapper statusMapper;

    @Override
    public void saveAllStatuses() {
        Arrays.stream(StatuEnum.values())
                .filter(name -> this.statusRepository.findByName(name).isEmpty())
                .map(this.statusMapper::map)
                .forEach(status -> {
                    this.statusRepository.saveAndFlush(status);
                    System.out.println(MessageConstants.ADD_STATUS + status.getName());
                });
    }

    @Override
    public Status getStatusByName(StatuEnum name) {
        return this.statusRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException(MessageConstants.STATUS_NOT_FOUND));
    }
}
