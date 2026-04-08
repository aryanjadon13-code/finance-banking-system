package com.finance_and_banking_sobp.accountService.controller;

import com.finance_and_banking_sobp.accountService.dto.AccountResponse;
import com.finance_and_banking_sobp.accountService.dto.CreateAccountRequest;
import com.finance_and_banking_sobp.accountService.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @PostMapping
    public AccountResponse createAccount(@RequestBody CreateAccountRequest request) {
        return service.createAccount(request);
    }

    @GetMapping("/{accountNumber}")
    public AccountResponse getAccount(@PathVariable String accountNumber) {
        return service.getAccount(accountNumber);
    }

    @GetMapping("/user/{userId}")
    public List<AccountResponse> getUserAccounts(@PathVariable Long userId) {
        return service.getAccountsByUser(userId);
    }

    @PutMapping("/{accountNumber}/balance")
    public void updateBalance(@PathVariable String accountNumber,
                              @RequestParam Double amount) {
        service.updateBalance(accountNumber, amount);
    }
}
