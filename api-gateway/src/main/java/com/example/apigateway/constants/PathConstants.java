package com.example.apigateway.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PathConstants {
    public static final Set<String> PUBLIC_PATHS = Set.of(
            "/auth/login",
            "/auth/register/client"
    );
}
