package com.example.apigateway.constants;

import com.example.apigateway.model.Route;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpMethod;

import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RouteConstants {
    public static final Set<Route> PUBLIC = Set.of(
            new Route("/auth/login", Set.of(HttpMethod.POST)),
            new Route("/auth/register/client", Set.of(HttpMethod.POST)),
            new Route("/restaurant/restaurants/**", Set.of(HttpMethod.GET))
    );
}
