package com.finance_and_banking_sobp.accountService.exception;


public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String message) {
        super(message);
    }
}