package com.finance_and_banking_sobp.transactionService.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private String fromAccount;
    private String toAccount;
    private Double amount;
}