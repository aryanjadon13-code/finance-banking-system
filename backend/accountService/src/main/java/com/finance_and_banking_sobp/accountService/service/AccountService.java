package com.finance_and_banking_sobp.accountService.service;


import com.finance_and_banking_sobp.accountService.dto.AccountResponse;
import com.finance_and_banking_sobp.accountService.dto.CreateAccountRequest;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(CreateAccountRequest request);

    AccountResponse getAccount(String accountNumber);

    List<AccountResponse> getAccountsByUser(Long userId);

    void updateBalance(String accountNumber, Double amount);
}
