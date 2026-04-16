package com.finance_and_banking_sobp.transactionService.exception;



public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String message) {
        super(message);
    }
}