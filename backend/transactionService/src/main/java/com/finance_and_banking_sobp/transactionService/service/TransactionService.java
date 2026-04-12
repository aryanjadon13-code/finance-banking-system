package com.finance_and_banking_sobp.transactionService.service;

import com.finance_and_banking_sobp.transactionService.dto.AccountResponse;
import com.finance_and_banking_sobp.transactionService.dto.TransactionRequest;
import com.finance_and_banking_sobp.transactionService.dto.TransferRequest;
import com.finance_and_banking_sobp.transactionService.entity.Transaction;
import com.finance_and_banking_sobp.transactionService.exception.InsufficientBalanceException;
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
        accountClient.updateBalance(request.getAccountNumber(), request.getAmount());

        saveTransaction(
                request.getAccountNumber(),
                null,
                request.getAmount(),
                "DEPOSIT",
                "CREDIT"
                );
    }

    public void withdraw(TransactionRequest request){

        AccountResponse account = accountClient.getAccount(request.getAccountNumber());
        if (account.getBalance() < request.getAmount()){
            throw new InsufficientBalanceException("Insufficient balance");
        }
        accountClient.updateBalance(request.getAccountNumber(),-request.getAmount());
        saveTransaction(
                request.getAccountNumber(),
                null,
                request.getAmount(),
                "WITHDRAW",
                "DEBIT"
        );
    }

    public void transfer(TransferRequest request){

        AccountResponse sender = accountClient.getAccount(request.getFromAccount());
        if (sender.getBalance() < request.getAmount()){
            throw new InsufficientBalanceException("Insufficient balance");
        }
//        deduct sender
        accountClient.updateBalance(request.getFromAccount(),-request.getAmount());
//        add reciever
        accountClient.updateBalance(request.getToAccount(), request.getAmount());

        try {

        // DEBIT entry (sender)
        saveTransaction(
                request.getFromAccount(),
                request.getToAccount(),
                request.getAmount(),

                "TRANSFER",
                "DEBIT"
        );

        // CREDIT entry (receiver)
        saveTransaction(
                request.getToAccount(),
                request.getFromAccount(),
                request.getAmount(),
                "TRANSFER",
                "CREDIT"
        );
        } catch (Exception e) {
            //  Rollback (VERY IMPORTANT)
            accountClient.updateBalance(request.getFromAccount(), request.getAmount());

            throw new InsufficientBalanceException("transaction failed");
        }
    }


    private void saveTransaction(String accountNumber, String referenceAccount, Double amount, String type, String direction ) {

        Transaction transaction = Transaction.builder()
                .transactionId(UUID.randomUUID().toString())
                .accountNumber(accountNumber)
                .referenceAccount(referenceAccount)
                .amount(amount)
                .type(type)
                .direction(direction)
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();
        transectionRepo.save(transaction);
    }

    public List<Transaction> getTransactions(String accountNumber) {
        return transectionRepo.findByAccountNumber(accountNumber);
    }
}
