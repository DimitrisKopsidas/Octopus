package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.ErrorResponseDto;
import com.dkopsidas.octopus.exception.*;
import com.dkopsidas.octopus.service.CrashLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@RequiredArgsConstructor
@ControllerAdvice
public class GlobalExceptionHandler {

    private final CrashLogService crashLogService;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .orElse("Validation Failed.");

        ErrorResponseDto errorResponseDto = new ErrorResponseDto(errorMessage);
        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }

    /**
     * Import problems come back as one 400 listing every bad entry, so the file
     * is fixed in a single pass instead of one upload per mistake.
     */
    @ExceptionHandler(QuestionImportException.class)
    public ResponseEntity<ErrorResponseDto> handleQuestionImportException(QuestionImportException ex) {
        String message = ex.getMessage() + ":\n" + String.join("\n", ex.getProblems());
        return ResponseEntity.badRequest().body(new ErrorResponseDto(message));
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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled Exception caught in GlobalExceptionHandler: ", ex);
        try {
            crashLogService.logCrash(
                    ex,
                    request.getRequestURI(),
                    request.getMethod(),
                    500,
                    null,
                    null,
                    null,
                    request.getHeader("User-Agent")
            );
        } catch (Exception loggingEx) {
            log.error("Failed to persist crash log", loggingEx);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDto("Internal server error: " + ex.getMessage()));
    }
}
