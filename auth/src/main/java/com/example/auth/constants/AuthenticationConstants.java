package com.example.auth.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthenticationConstants {
    public static final String JWT_ROLE = "role";
    public static final String REDIS_BLACKLIST = "blacklist:";
}
