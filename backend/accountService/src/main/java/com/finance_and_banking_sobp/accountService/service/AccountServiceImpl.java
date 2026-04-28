package com.finance_and_banking_sobp.accountService.service;

import com.finance_and_banking_sobp.accountService.TransactionClient;
import com.finance_and_banking_sobp.accountService.dto.*;
import com.finance_and_banking_sobp.accountService.entity.Account;
import com.finance_and_banking_sobp.accountService.exception.*;
import com.finance_and_banking_sobp.accountService.models.AccountType;
import com.finance_and_banking_sobp.accountService.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository repo;
    private final BCryptPasswordEncoder encoder;
    private final TransactionClient transactionClient;

    @Override
    public AccountResponse createAccount(CreateAccountRequest request) {

        Account account = Account.builder()
                .accountNumber(generateAccountNumber())
                .accountType(AccountType.valueOf(request.getAccountType().toUpperCase()))
                .balance(request.getInitialDeposit())
                .branchName(request.getBranchName())
                .currency("INR")
                .status("ACTIVE")
                .nomineeName(request.getNomineeName())
                .nomineeRelation(request.getNomineeRelation())
                .pin(encoder.encode(request.getPin()))
                .userId(request.getUserId())
                .createdAt(LocalDateTime.now())
                .build();

        repo.save(account);

        // Record the initial deposit as a transaction
        try {
            if (request.getInitialDeposit() != null && request.getInitialDeposit() > 0) {
                transactionClient.record(new TransactionRequest(
                        account.getAccountNumber(),
                        request.getInitialDeposit(),
                        "Initial Deposit - Account Opening"
                ));
            }
        } catch (Exception e) {
            log.warn("Could not record initial deposit transaction: {}", e.getMessage());
        }

        return map(account);
    }

    @Override
    public AccountResponse getAccount(String accountNumber) {
        return map(find(accountNumber));
    }

    @Override
    public List<AccountResponse> getAccountsByUserId(Long userId) {
        return repo.findByUserId(userId).stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public void updateBalance(String accountNumber, Double amount) {

        Account acc = find(accountNumber);

        double newBalance = acc.getBalance() + amount;

        if (newBalance < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        acc.setBalance(newBalance);
        repo.save(acc);
    }

    @Override
    public void validatePin(PinRequest request) {

        Account acc = find(request.getAccountNumber());

        if (!encoder.matches(request.getPin(), acc.getPin())) {
            throw new InvalidPinException("Invalid PIN");
        }
    }

    private Account find(String accNo) {
        return repo.findByAccountNumber(accNo)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
    }

    private AccountResponse map(Account acc) {
        return AccountResponse.builder()
                .accountNumber(acc.getAccountNumber())
                .accountType(acc.getAccountType().name())
                .balance(acc.getBalance())
                .branchName(acc.getBranchName())
                .currency(acc.getCurrency())
                .nomineeName(acc.getNomineeName())
                .nomineeRelation(acc.getNomineeRelation())
                .status(acc.getStatus())
                .userId(acc.getUserId())
                .build();
    }

    private String generateAccountNumber() {
        LocalDate now = LocalDate.now();

        int year = now.getYear();
        int month = now.getMonthValue();

        String formattedMonth = String.format("%02d", month);

        int randomNumber = 1000 + new Random().nextInt(9000);

        return "ACC" + year + formattedMonth + randomNumber;
    }
}