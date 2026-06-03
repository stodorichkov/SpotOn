package com.example.apigateway.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class HederConstants {
    public static final String USER_ID = "X-User-Id";
    public static final String USER_JTI = "X-User-Jti";
    public static final String USER_ROLE = "X-User-Role";
    public static final String USER_EXPIRATION = "X-User-Expiration";
}
