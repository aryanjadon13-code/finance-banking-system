package com.finance_and_banking_sobp.transactionService.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionFilterRequest {

    private String accountNumber;

    private String type = "ALL";
    private String dateFilter = "ALL";

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private int page = 0;
}