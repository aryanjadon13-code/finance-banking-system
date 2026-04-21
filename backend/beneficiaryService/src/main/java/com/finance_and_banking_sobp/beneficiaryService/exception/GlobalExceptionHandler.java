package com.finance_and_banking_sobp.beneficiaryService.exception;

import com.finance_and_banking_sobp.beneficiaryService.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BeneficiaryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            BeneficiaryNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "Beneficiary Not Found", HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
            UnauthorizedAccessException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "Unauthorized Access", HttpStatus.UNAUTHORIZED, request);
    }

    @ExceptionHandler(DuplicateBeneficiaryException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(
            DuplicateBeneficiaryException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "Duplicate Beneficiary", HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        return buildResponse(
                "User with this account number already exists",
                "Duplicate Beneficiary",
                HttpStatus.BAD_REQUEST,
                request
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    private ResponseEntity<ErrorResponse> buildResponse(
            String message,
            String error,
            HttpStatus status,
            HttpServletRequest request
    ) {
        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(error)
                .message(message)
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(response, status);
    }
}
