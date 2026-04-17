package com.finance_and_banking_sobp.accountService.dto;

import lombok.Data;

@Data
public class TransactionRequest {

    private String accountNumber;
    private Double amount;
}