package com.finance_and_banking_sobp.accountService.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountResponse {

    private String accountNumber;
    private String accountType;
    private Double balance;
}