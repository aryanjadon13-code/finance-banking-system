package com.finance_and_banking_sobp.transactionService.controller;

import com.finance_and_banking_sobp.transactionService.dto.TransactionRequest;
import com.finance_and_banking_sobp.transactionService.dto.TransferRequest;
import com.finance_and_banking_sobp.transactionService.entity.Transaction;
import com.finance_and_banking_sobp.transactionService.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public void deposit(@RequestBody TransactionRequest request) {
        transactionService.deposit(request);
    }

    @PostMapping("/withdraw")
    public void withdraw(@RequestBody TransactionRequest request) {
        transactionService.withdraw(request);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestBody TransferRequest request) {
        transactionService.transfer(request);

    }
    @GetMapping("/{accountNumber}")
    public List<Transaction> getTransactions(@PathVariable String accountNumber) {
        return transactionService.getTransactions(accountNumber);
    }
}
