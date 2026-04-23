package com.finance_and_banking_sobp.transactionService.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ErrorResponse {

    private String status;   // ✅ change int → String
    private String message;
    private LocalDateTime timestamp;
}
