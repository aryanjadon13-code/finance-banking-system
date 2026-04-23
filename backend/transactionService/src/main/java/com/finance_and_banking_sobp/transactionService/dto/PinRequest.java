package com.finance_and_banking_sobp.transactionService.dto;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PinRequest {
    private String accountNumber;
    private String pin;
}