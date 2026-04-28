package com.finance_and_banking_sobp.accountService.service;

import com.finance_and_banking_sobp.accountService.dto.*;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(CreateAccountRequest request);

    AccountResponse getAccount(String accountNumber);

    List<AccountResponse> getAccountsByUserId(Long userId);

    void updateBalance(String accountNumber, Double amount);

    void validatePin(PinRequest request);
}