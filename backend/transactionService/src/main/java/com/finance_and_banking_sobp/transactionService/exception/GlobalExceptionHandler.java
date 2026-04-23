package com.finance_and_banking_sobp.transactionService.exception;

import com.finance_and_banking_sobp.transactionService.dto.ErrorResponse;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================
    // 🔴 VALIDATION ERROR
    // =========================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(err.getField(), err.getDefaultMessage())
        );

        return ResponseEntity.badRequest().body(errors);
    }

    // =========================
    // 🔴 INSUFFICIENT BALANCE
    // =========================
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<ErrorResponse> handleBalance(InsufficientBalanceException ex) {

        return ResponseEntity.badRequest().body(
                ErrorResponse.builder()
                        .status("FAILED")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // =========================
    // 🔴 INVALID AMOUNT
    // =========================
    @ExceptionHandler(InvalidAmountException.class)
    public ResponseEntity<ErrorResponse> handleAmount(InvalidAmountException ex) {

        return ResponseEntity.badRequest().body(
                ErrorResponse.builder()
                        .status("FAILED")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // =========================
    // 🔴 RESOURCE NOT FOUND
    // =========================
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse.builder()
                        .status("FAILED")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // =========================
    // 🔴 FEIGN EXCEPTION (VERY IMPORTANT 🔥)
    // =========================
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeign(FeignException ex) {

        String message = "Service error";

        try {
            String response = ex.contentUTF8();

            if (response.contains("Invalid PIN")) {
                message = "Invalid PIN";
            } else if (response.contains("Insufficient balance")) {
                message = "Insufficient balance";
            } else {
                message = response;
            }

        } catch (Exception e) {
            message = ex.getMessage();
        }

        return ResponseEntity.badRequest().body(
                ErrorResponse.builder()
                        .status("FAILED")
                        .message(message)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // =========================
    // 🔴 GENERIC RUNTIME
    // =========================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {

        return ResponseEntity.badRequest().body(
                ErrorResponse.builder()
                        .status("FAILED")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // =========================
    // 🔴 GENERAL EXCEPTION (LAST)
    // =========================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {

        ex.printStackTrace(); // 🔥 IMPORTANT for debugging

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ErrorResponse.builder()
                        .status("FAILED")
                        .message("Something went wrong")
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}