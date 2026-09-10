package com.example.auth.exception;

import com.example.auth.constants.MessageConstants;
import com.example.auth.model.payload.response.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final ObjectMapper objectMapper;
    private final MessageSource messageSource;

    @ExceptionHandler({
            BadRequestException.class,
            MissingRequestHeaderException.class,
            MethodArgumentNotValidException.class
    })
    public ResponseEntity<ErrorResponse> handle(Exception ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        if (ex instanceof MethodArgumentNotValidException validationEx) {
            final var errors = validationEx.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            error -> Optional.ofNullable(error.getDefaultMessage()).orElse(""),
                            (existingMessage, newMessage) -> existingMessage + " " + newMessage
                    ));

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(errors));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(this.resolveMessage(ex.getMessage())));
        }
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handle(UnauthorizedException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(this.resolveMessage(ex.getMessage())));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handle(AccessDeniedException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(this.resolveMessage(ex.getMessage())));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(this.resolveMessage(ex.getMessage())));
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(FeignException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        int status = ex.status();
        if (status < 100 || status > 599) {
            status = HttpStatus.INTERNAL_SERVER_ERROR.value();
        }

        return ResponseEntity.status(status).body(this.parseErrorResponse(ex.contentUTF8()));
    }

    private ErrorResponse parseErrorResponse(String content) {
        try {
            return this.objectMapper.readValue(content, ErrorResponse.class);
        } catch (Exception e) {
            return new ErrorResponse(content);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(this.resolveMessage(MessageConstants.INTERNAL_SERVER_ERROR)));
    }

    private String resolveMessage(String message) {
        if (message == null || !message.startsWith("{") || !message.endsWith("}")) {
            return message;
        }

        final var key = message.substring(1, message.length() - 1);
        try {
            return this.messageSource.getMessage(key, null, LocaleContextHolder.getLocale());
        } catch (NoSuchMessageException ex) {
            return message;
        }
    }
}
