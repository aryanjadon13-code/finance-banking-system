package com.finance_and_banking_sobp.accountService.controller;

import com.finance_and_banking_sobp.accountService.dto.*;
import com.finance_and_banking_sobp.accountService.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateAccountRequest request) {
        return ResponseEntity.ok(service.createAccount(request));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<?> get(@PathVariable String accountNumber) {
        return ResponseEntity.ok(service.getAccount(accountNumber));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAccountsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getAccountsByUserId(userId));
    }

    @PutMapping("/{accountNumber}/balance")
    public void updateBalance(@PathVariable String accountNumber,
                              @RequestParam Double amount) {
        service.updateBalance(accountNumber, amount);
    }

    @PostMapping("/validate-pin")
    public void validatePin(@RequestBody PinRequest request) {
        service.validatePin(request);
    }
}