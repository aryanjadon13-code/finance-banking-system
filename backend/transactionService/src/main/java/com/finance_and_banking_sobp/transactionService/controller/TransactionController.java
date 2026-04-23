package com.finance_and_banking_sobp.transactionService.controller;

import com.finance_and_banking_sobp.transactionService.dto.*;
import com.finance_and_banking_sobp.transactionService.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(service.deposit(request));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(service.withdraw(request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(service.transfer(request));
    }

    @PostMapping("/filter")
    public ResponseEntity<?> filter(@RequestBody TransactionFilterRequest request) {
        return ResponseEntity.ok(service.getTransactions(request));
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(service.getTransactionsByUser(userId, page));
    }
}