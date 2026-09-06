package com.example.restaurant.config;

import com.example.restaurant.constants.HeaderConstants;
import com.example.restaurant.model.enums.ServiceEnum;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

@Component
public class FeignHeaderInterceptor implements RequestInterceptor {
    @Value("${service.secret}")
    private String serviceSecret;

    @Override
    public void apply(RequestTemplate template) {
        final var request = Optional.ofNullable(RequestContextHolder.getRequestAttributes())
                .filter(ServletRequestAttributes.class::isInstance)
                .map(ServletRequestAttributes.class::cast)
                .map(ServletRequestAttributes::getRequest)
                .orElse(null);

        if (request == null) {
            return;
        }

        template.header(HeaderConstants.ITERNAL_SERVICE, String.valueOf(ServiceEnum.RESTAURANT));
        template.header(HeaderConstants.ITERNAL_SECRET, serviceSecret);

        Optional.ofNullable(request.getHeader(HeaderConstants.USER_ID))
                .ifPresent(userId -> template.header(HeaderConstants.USER_ID, userId));

        Optional.ofNullable(request.getHeader(HeaderConstants.USER_ROLE))
                .ifPresent(userRole -> template.header(HeaderConstants.USER_ROLE, userRole));

        Optional.ofNullable(request.getHeader(HeaderConstants.RESTAURANT_ID))
                .ifPresent(restaurantId -> template.header(HeaderConstants.RESTAURANT_ID, restaurantId));

        Optional.ofNullable(request.getHeader(HttpHeaders.ACCEPT_LANGUAGE))
                .ifPresent(acceptLanguage -> template.header(HttpHeaders.ACCEPT_LANGUAGE, acceptLanguage));
    }
}
