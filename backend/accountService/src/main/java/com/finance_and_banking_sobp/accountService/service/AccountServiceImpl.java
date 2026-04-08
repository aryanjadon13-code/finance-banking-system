package com.finance_and_banking_sobp.accountService.service;

import com.finance_and_banking_sobp.accountService.dto.AccountResponse;
import com.finance_and_banking_sobp.accountService.dto.CreateAccountRequest;
import com.finance_and_banking_sobp.accountService.entity.Account;
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
    
    @Override
    public AccountResponse createAccount(CreateAccountRequest request) {
        Account account =Account.builder()
                .accountNumber(generateAccountNumber())
                .accountType(AccountType.valueOf(request.getAccountType()))
                .balance(0.0)
                .userId(request.getUserId())
                .createdAt(LocalDateTime.now())
                .build();
        accountRepository.save(account);
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
        Account account =accountRepository.findByAccountNumber(accountNumber).orElseThrow(()->new RuntimeException("Account not found"));
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);
    }


    private AccountResponse maptoResponse(Account account) {
        return AccountResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountNumber())
                .balance(account.getBalance())
                .build();
    }

    private String generateAccountNumber() {
        String year = String.valueOf(java.time.Year.now().getValue());
        int random = (int)(Math.random() * 900000) + 100000;
        return "ACC" + year + random;
    }
}
