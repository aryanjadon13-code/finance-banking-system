package com.finance_and_banking_sobp.accountService.service;

import com.finance_and_banking_sobp.accountService.TransactionClient;
import com.finance_and_banking_sobp.accountService.dto.AccountResponse;
import com.finance_and_banking_sobp.accountService.dto.CreateAccountRequest;
import com.finance_and_banking_sobp.accountService.dto.TransactionRequest;
import com.finance_and_banking_sobp.accountService.entity.Account;
import com.finance_and_banking_sobp.accountService.exception.AccountNotFoundException;
import com.finance_and_banking_sobp.accountService.exception.InsufficientBalanceException;
import com.finance_and_banking_sobp.accountService.models.AccountType;
import com.finance_and_banking_sobp.accountService.repository.AccountRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService{
    
    private final AccountRepository accountRepository;
    private final TransactionClient transactionClient;
    
    @Override
    public AccountResponse createAccount(CreateAccountRequest request) {

        if (request.getInitialDeposit()==null || request.getInitialDeposit()<1000){
            throw new RuntimeException("initial deposite must be greater than 500 rupees");
        }
        if (request.getBranchName() == null || request.getBranchName().isEmpty()) {
            throw new RuntimeException("Branch name is required");
        }

        Account account =Account.builder()
                .accountNumber(generateAccountNumber())
                .accountType(AccountType.valueOf(request.getAccountType().name()))
                .balance(0.0)
                .branchName(request.getBranchName())
                .currency(
                        request.getCurrency()==null || request.getCurrency().isEmpty()
                ?"INR"
                        : request.getCurrency())
                .status("ACTIVE")
                .userId(1L)
                .createdAt(LocalDateTime.now())
                .build();
        accountRepository.save(account);

        if (request.getInitialDeposit() !=null && request.getInitialDeposit()>500){

            TransactionRequest transactionRequest = new TransactionRequest();
            transactionRequest.setAccountNumber(account.getAccountNumber());
            transactionRequest.setAmount(request.getInitialDeposit());

            transactionClient.deposit(transactionRequest);
        }

        return maptoResponse(account);
    }


    @Override
    public AccountResponse getAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElseThrow(()->new RuntimeException("Account not found"));
        return maptoResponse(account);
    }

    @Override
    public List<AccountResponse> getAccountsByUser(Long userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::maptoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateBalance(String accountNumber, Double amount) {
        Account account =accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(()->new AccountNotFoundException("Account not found"));

        double newBalance = account.getBalance() + amount;
        if (newBalance < 0){
            throw new InsufficientBalanceException("insufficient balance");
        }
        account.setBalance(newBalance);
        accountRepository.save(account);
    }


    private AccountResponse maptoResponse(Account account) {
        return AccountResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .status(account.getStatus())
                .branchName(account.getBranchName())
                .currency(account.getCurrency())
                .build();
    }

    private String generateAccountNumber() {
        String year = String.valueOf(java.time.Year.now().getValue());
        int random = (int)(Math.random() * 900000) + 100000;
        return "ACC" + year + random;
    }
}
