package com.finance_and_banking_sobp.transactionService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionViewResponse {

    // What user sees in UI
    private String name;     // e.g. "Salary Credit", "Amazon Shopping"

    private String type;     // "credit" or "debit"

    private String amount;   // "+₹5000" or "-₹1200"

    private String status;   // "Completed" or "Failed"

    private String date;     // "2026-04-22"
}