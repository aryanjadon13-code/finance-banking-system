package com.finance_and_banking_sobp.transactionService.exception;

public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String msg) {
        super(msg);
    }
}