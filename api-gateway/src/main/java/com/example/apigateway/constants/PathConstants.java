package com.example.apigateway.constants;

import com.example.apigateway.model.PublicRoute;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpMethod;

import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PathConstants {
    public static final Set<PublicRoute> PUBLIC_PATHS = Set.of(
            new PublicRoute("/auth/login", Set.of(HttpMethod.POST)),
            new PublicRoute("/auth/register/client", Set.of(HttpMethod.POST)),
            new PublicRoute("restaurant/restaurants", Set.of(HttpMethod.GET))
    );
}
