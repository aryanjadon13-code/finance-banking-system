package com.finance_and_banking_sobp.transactionService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse<T> {

    private String status;   // SUCCESS / FAILED
    private String message;  // readable message
    private T data;          // actual response data
}