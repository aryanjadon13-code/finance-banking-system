package com.finance_and_banking_sobp.transactionService.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransactionRequest {

    @NotBlank
    private String accountNumber;

    @NotNull
    @Positive(message = "Amount must be greater than 0")
    private Double amount;

    private String description;
}