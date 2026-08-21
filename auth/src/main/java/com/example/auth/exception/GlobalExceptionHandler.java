package com.example.auth.exception;

import com.example.auth.constants.MessageConstants;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
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
public class GlobalExceptionHandler {
    @ExceptionHandler({
            BadRequestException.class,
            MissingRequestHeaderException.class,
            MethodArgumentNotValidException.class
    })
    public ResponseEntity<?> handle(Exception ex) {
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

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handle(UnauthorizedException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handle(AccessDeniedException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(NotFoundException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<String> handleFeignException(FeignException ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        int status = ex.status();
        if (status < 100 || status > 599) {
            status = HttpStatus.INTERNAL_SERVER_ERROR.value();
        }

        return ResponseEntity.status(status).body(ex.contentUTF8());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageConstants.INTERNAL_SERVER_ERROR);
    }
}
