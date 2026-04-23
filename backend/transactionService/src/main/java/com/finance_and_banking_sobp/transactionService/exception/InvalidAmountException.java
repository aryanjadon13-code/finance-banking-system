package com.finance_and_banking_sobp.transactionService.exception;

public class InvalidAmountException extends RuntimeException {
    public InvalidAmountException(String msg) {
        super(msg);
    }
}