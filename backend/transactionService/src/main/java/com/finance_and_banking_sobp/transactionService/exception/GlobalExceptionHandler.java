package com.finance_and_banking_sobp.transactionService.exception;


import com.finance_and_banking_sobp.transactionService.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ✅ Account Not Found
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAccountNotFound(
            AccountNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "Account Not Found", HttpStatus.NOT_FOUND, request);
    }

    // ✅ Insufficient Balance
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientBalance(
            InsufficientBalanceException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "Insufficient Balance", HttpStatus.BAD_REQUEST, request);
    }

    // ✅ Invalid Amount
    @ExceptionHandler(InvalidAmountException.class)
    public ResponseEntity<ErrorResponse> handleInvalidAmount(
            InvalidAmountException ex,
            HttpServletRequest request
    ) {
        return buildResponse(ex.getMessage(), "Invalid Amount", HttpStatus.BAD_REQUEST, request);
    }

    // ✅ Validation Errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // ✅ Generic Exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildResponse(
                ex.getMessage(),
                "Internal Server Error",
                HttpStatus.INTERNAL_SERVER_ERROR,
                request
        );
    }

    // ✅ Common Builder Method (Reusable)
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