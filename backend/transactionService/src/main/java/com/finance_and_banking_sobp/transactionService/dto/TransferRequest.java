package com.finance_and_banking_sobp.transactionService.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransferRequest {

    @NotBlank
    private String fromAccount;

    @NotBlank
    private String toAccount;

    @NotNull
    @Positive(message = "Amount must be greater than 0")
    private Double amount;

    @NotBlank
    private String pin;

    private String description;
}