package com.example.booking.exception;

import com.example.booking.constants.MessageConstants;
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
            MethodArgumentNotValidException.class,
            FeignException.BadRequest.class
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
        } else if (ex instanceof FeignException.BadRequest feignEx) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(feignEx.contentUTF8());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @ExceptionHandler({
            AccessDeniedException.class,
            FeignException.Forbidden.class
    })
    public ResponseEntity<String> handleAccessDeniedException(Exception ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        if (ex instanceof FeignException.Forbidden feignEx) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(feignEx.contentUTF8());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @ExceptionHandler({
            NotFoundException.class,
            FeignException.NotFound.class
    })
    public ResponseEntity<String> handleNotFoundException(Exception ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        if (ex instanceof FeignException.NotFound feignEx) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(feignEx.contentUTF8());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        log.error(ex.getMessage());
        log.info(ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(MessageConstants.INTERNAL_SERVER_ERROR);
    }
}
