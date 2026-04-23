package com.finance_and_banking_sobp.transactionService.dto;

import lombok.Data;

@Data
public class AccountResponse {
    private String accountNumber;
    private Double balance;
    private Long userId;
}
