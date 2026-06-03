package com.example.apigateway.exception;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NullMarked;
import org.springframework.boot.webflux.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@Order(-1)
@NullMarked
public class GlobalExceptionHandler implements ErrorWebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return this.handleException(exchange, ex);
    }

    private Mono<Void> handleException(ServerWebExchange exchange, Throwable ex) {
        return switch (ex) {
            case UnauthorizedException unauthorizedEx -> handleUnauthorized(exchange, unauthorizedEx);
            default -> handleGenericException(exchange, ex);
        };
    }


    private Mono<Void> handleUnauthorized(ServerWebExchange exchange, UnauthorizedException ex) {
        final var response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);

        return response.setComplete();
    }

    private Mono<Void> handleGenericException(ServerWebExchange exchange, Throwable ex) {
        final var response = exchange.getResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);

        return response.setComplete();
    }

}
