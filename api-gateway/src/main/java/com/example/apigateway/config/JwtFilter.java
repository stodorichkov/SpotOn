package com.example.apigateway.config;

import com.example.apigateway.constants.HederConstants;
import com.example.apigateway.constants.JwtConstants;
import com.example.apigateway.service.JwtService;
import com.example.apigateway.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NullMarked;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Order(0)
@NullMarked
public class JwtFilter implements GlobalFilter {
    private final RequestService requestService;
    private final JwtService jwtService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        final var request = exchange.getRequest();

        if (this.requestService.isPublic(request)) {
            return chain.filter(exchange);
        }

        final var jwt = this.requestService.extractJwt(request);
        final var claims = this.jwtService.extractAllClaims(jwt);
        final var jti = this.jwtService.extractJti(claims);
        final var userId = this.jwtService.extractUserId(claims);
        final var role = this.jwtService.extractRole(claims);
        final var exp = this.jwtService.extractExpiration(claims);

        final var requestBuilder = exchange.getRequest().mutate()
                .header(HederConstants.USER_JTI, jti)
                .header(HederConstants.USER_ID, userId.toString())
                .header(HederConstants.USER_ROLE, role)
                .header(HederConstants.USER_EXPIRATION, exp.toString());

        if (claims.containsKey(JwtConstants.RESTAURANT_ID)) {
            final var restaurantId = this.jwtService.extractRestaurantId(claims);

            requestBuilder.header(HederConstants.RESTAURANT_ID, restaurantId.toString());
        }

        final var modifiedRequest = requestBuilder.build();

        final var modifiedExchange = exchange.mutate()
                .request(modifiedRequest)
                .build();

        return chain.filter(modifiedExchange);
    }
}
