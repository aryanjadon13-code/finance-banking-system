package com.finance_and_banking_sobp.transactionService.dto;


import lombok.Data;

@Data
public class TransactionFilterRequest {

    // CREDIT / DEBIT / ALL
    private String type;

    // LAST_7_DAYS / LAST_MONTH / CUSTOM
    private String dateFilter;

    // Used only if CUSTOM
    private String fromDate;
    private String toDate;
}
