package com.example.auth.config;

import com.example.auth.constants.HeaderConstants;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

@Component
public class FeignHeaderInterceptor implements RequestInterceptor {

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

        Optional.ofNullable(request.getHeader(HeaderConstants.USER_ID))
                .ifPresent(userId -> template.header(HeaderConstants.USER_ID, userId));

        Optional.ofNullable(request.getHeader(HeaderConstants.USER_ROLE))
                .ifPresent(userRole -> template.header(HeaderConstants.USER_ROLE, userRole));

        Optional.ofNullable(request.getHeader(HeaderConstants.RESTAURANT_ID))
                .ifPresent(restaurantId -> template.header(HeaderConstants.RESTAURANT_ID, restaurantId));
    }
}
