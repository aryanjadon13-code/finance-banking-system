package com.finance_and_banking_sobp.transactionService.service;

import com.finance_and_banking_sobp.transactionService.dto.AccountResponse;
import com.finance_and_banking_sobp.transactionService.dto.TransactionRequest;
import com.finance_and_banking_sobp.transactionService.dto.TransferRequest;
import com.finance_and_banking_sobp.transactionService.entity.Transaction;
import com.finance_and_banking_sobp.transactionService.exception.InsufficientBalanceException;
import com.finance_and_banking_sobp.transactionService.exception.InvalidAmountException;
import com.finance_and_banking_sobp.transactionService.feign.AccountClient;
import com.finance_and_banking_sobp.transactionService.repository.TransectionRepo;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {
     private final TransectionRepo transectionRepo;
     private final AccountClient accountClient;


    public void deposit (TransactionRequest request){
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new InvalidAmountException("Amount must be greater than 0");
        }
        try {
            accountClient.updateBalance(request.getAccountNumber(), request.getAmount());

            saveTransaction(
                    request.getAccountNumber(),
                    null,
                    request.getAmount(),
                    "DEPOSIT",
                    "CREDIT",
                    "SUCCESS"
            );

        } catch (Exception e) {

            saveTransaction(
                    request.getAccountNumber(),
                    null,
                    request.getAmount(),
                    "DEPOSIT",
                    "CREDIT",
                    "FAILED"
            );

            throw new RuntimeException("Deposit failed");
        }
    }

    public void withdraw(TransactionRequest request){

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new InvalidAmountException("Amount must be greater than 0");
        }
        AccountResponse account = accountClient.getAccount(request.getAccountNumber());
        if (account.getBalance() < request.getAmount()){
            throw new InsufficientBalanceException("Insufficient balance");
        }
        try {
            accountClient.updateBalance(request.getAccountNumber(), -request.getAmount());

            saveTransaction(
                    request.getAccountNumber(),
                    null,
                    request.getAmount(),
                    "WITHDRAW",
                    "DEBIT",
                    "SUCCESS"
            );

        } catch (Exception e) {

            saveTransaction(
                    request.getAccountNumber(),
                    null,
                    request.getAmount(),
                    "WITHDRAW",
                    "DEBIT",
                    "FAILED"
            );

            throw new RuntimeException("Withdraw failed");
        }
    }

    public void transfer(TransferRequest request){
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new InvalidAmountException("Amount must be greater than 0");
        }
        if (request.getFromAccount().equals(request.getToAccount())) {
            throw new RuntimeException("Cannot transfer to same account");
        }

//        checking if account existes or not
        AccountResponse sender = accountClient.getAccount(request.getFromAccount());
        AccountResponse receiver = accountClient.getAccount(request.getToAccount());

        if (sender.getBalance() < request.getAmount()){
            throw new InsufficientBalanceException("Insufficient balance");
        }
        try {
            // 1. Deduct sender
            accountClient.updateBalance(request.getFromAccount(), -request.getAmount());
            // 2. Add receiver
            accountClient.updateBalance(request.getToAccount(), request.getAmount());

        // DEBIT entry (sender)
        saveTransaction(
                request.getFromAccount(),
                request.getToAccount(),
                request.getAmount(),
                "TRANSFER",
                "DEBIT",
                "SUCCESS"
        );

        // CREDIT entry (receiver)
        saveTransaction(
                request.getToAccount(),
                request.getFromAccount(),
                request.getAmount(),
                "TRANSFER",
                "CREDIT",
                "SUCCESS"
        );
        } catch (Exception e) {
            // 🔥 ROLLBACK (only sender because receiver may not be credited yet)
            try {
                accountClient.updateBalance(request.getFromAccount(), request.getAmount());
            } catch (Exception rollbackEx) {
                System.out.println("Rollback failed: " + rollbackEx.getMessage());
            }

            // ❗ Save FAILED transaction
            saveTransaction(
                    request.getFromAccount(),
                    request.getToAccount(),
                    request.getAmount(),
                    "TRANSFER",
                    "DEBIT",
                    "FAILED"
            );

            throw new RuntimeException("Transaction failed");
        }
    }


    private void saveTransaction(String accountNumber, String referenceAccount, Double amount, String type, String direction,String status ) {

        Transaction transaction = Transaction.builder()
                .transactionId(UUID.randomUUID().toString())
                .accountNumber(accountNumber)
                .referenceAccount(referenceAccount)
                .amount(amount)
                .type(type)
                .direction(direction)
                .status(status)
                .createdAt(LocalDateTime.now())
                .build();
        transectionRepo.save(transaction);
    }


    public List<Transaction> getTransactions(String accountNumber) {
        return transectionRepo.findByAccountNumber(accountNumber);
    }
}
