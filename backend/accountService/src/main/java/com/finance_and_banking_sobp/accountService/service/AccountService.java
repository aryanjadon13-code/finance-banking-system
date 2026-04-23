package com.finance_and_banking_sobp.accountService.service;

import com.finance_and_banking_sobp.accountService.dto.*;

public interface AccountService {

    AccountResponse createAccount(CreateAccountRequest request);

    AccountResponse getAccount(String accountNumber);

    void updateBalance(String accountNumber, Double amount);

    void validatePin(PinRequest request);
}