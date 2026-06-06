package com.example.auth.service;

import com.example.auth.constants.MessageConstants;
import com.example.auth.mapper.role.RoleMapper;
import com.example.auth.model.enums.RoleEnum;
import com.example.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    public void saveAllRoles() {
        Arrays.stream(RoleEnum.values())
                .filter(roleName -> this.roleRepository.findByName(roleName).isEmpty())
                .map(this.roleMapper::map)
                .forEach(newRole -> {
                    this.roleRepository.saveAndFlush(newRole);
                    System.out.println(MessageConstants.ADD_ROLE + newRole.getName());
                });
    }
}
