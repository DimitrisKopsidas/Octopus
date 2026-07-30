package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.ErrorResponseDto;
import com.dkopsidas.octopus.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.UUID;

@RequiredArgsConstructor
@ControllerAdvice
public class GlobalExceptionHandler {
    //jimbi
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .orElse("Validation Failed.");

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(errorMessage);
        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SimpleException.class)
    public ResponseEntity<String> handleSimpleExceptions(SimpleException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler({
            InvalidCredentialsException.class,
            MissingRefreshTokenException.class,
            InactiveAccountException.class,
            RefreshTokenException.class
    })
    public ResponseEntity<ErrorResponseDto> handleAuthenticationExceptions(
            RuntimeException exception
    ) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponseDto(exception.getMessage()));
    }
}
