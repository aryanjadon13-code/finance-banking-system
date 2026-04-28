package com.finance_and_banking_sobp.transactionService.service;

import com.finance_and_banking_sobp.transactionService.dto.*;
import com.finance_and_banking_sobp.transactionService.entity.Transaction;
import com.finance_and_banking_sobp.transactionService.exception.*;
import com.finance_and_banking_sobp.transactionService.feign.AccountClient;
import com.finance_and_banking_sobp.transactionService.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repo;
    private final AccountClient accountClient;

    // ================= DEPOSIT =================
    public ApiResponse<?> deposit(TransactionRequest request) {

        AccountResponse acc = accountClient.getAccount(request.getAccountNumber());
        accountClient.updateBalance(request.getAccountNumber(), request.getAmount());

        save(request.getAccountNumber(), null, request.getAmount(),
                "DEPOSIT", "CREDIT", "SUCCESS", request.getDescription(),acc.getUserId(),null );

        return success("Deposit successful");
    }

    // ================= RECORD ONLY (No Balance Update) =================
    public ApiResponse<?> record(TransactionRequest request) {
        AccountResponse acc = accountClient.getAccount(request.getAccountNumber());
        
        save(request.getAccountNumber(), null, request.getAmount(),
                "INITIAL_DEPOSIT", "CREDIT", "SUCCESS", request.getDescription(), acc.getUserId(), null);

        return success("Transaction recorded");
    }

    // ================= WITHDRAW =================
    public ApiResponse<?> withdraw(TransactionRequest request) {
        AccountResponse acc = accountClient.getAccount(request.getAccountNumber());

        if (acc.getBalance() < request.getAmount()) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        accountClient.updateBalance(request.getAccountNumber(), -request.getAmount());

        save(request.getAccountNumber(), null, request.getAmount(),
                "WITHDRAW", "DEBIT", "SUCCESS", request.getDescription(),acc.getUserId(),null);

        return success("Withdraw successful");
    }

    // ================= TRANSFER =================
    public ApiResponse<?> transfer(TransferRequest request) {

        if (request.getFromAccount().equals(request.getToAccount())) {
            throw new RuntimeException("Cannot transfer to same account");
        }

        accountClient.validatePin(new PinRequest(request.getFromAccount(), request.getPin()));

        AccountResponse sender = accountClient.getAccount(request.getFromAccount());
        AccountResponse receiver = accountClient.getAccount(request.getToAccount());

        if (sender.getBalance() < request.getAmount()) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        accountClient.updateBalance(request.getFromAccount(), -request.getAmount());
        accountClient.updateBalance(request.getToAccount(), request.getAmount());

        save(request.getFromAccount(), request.getToAccount(),
                request.getAmount(), "TRANSFER", "DEBIT", "SUCCESS", request.getDescription(),sender.getUserId(),
                receiver.getUserId());

        save(request.getToAccount(), request.getFromAccount(),
                request.getAmount(), "TRANSFER", "CREDIT", "SUCCESS", request.getDescription() , sender.getUserId(),
                receiver.getUserId());

        return success("Transfer successful");
    }

    // ================= FILTER =================
    public ApiResponse<?> getTransactions(TransactionFilterRequest request) {

        Pageable pageable = PageRequest.of(request.getPage(), 5, Sort.by("createdAt").descending());

        Page<Transaction> pageResult;

        LocalDateTime start = null;
        LocalDateTime end = LocalDateTime.now();

        if ("LAST_7_DAYS".equalsIgnoreCase(request.getDateFilter())) {
            start = LocalDateTime.now().minusDays(7);
        } else if ("LAST_MONTH".equalsIgnoreCase(request.getDateFilter())) {
            start = LocalDateTime.now().minusMonths(1);
        } else if ("CUSTOM".equalsIgnoreCase(request.getDateFilter())) {
            start = request.getStartDate();
            end = request.getEndDate();
        }

        boolean hasType = !"ALL".equalsIgnoreCase(request.getType());
        boolean hasDate = start != null;

        if (hasType && hasDate) {
            pageResult = repo.findByAccountNumberAndDirectionAndCreatedAtBetween(
                    request.getAccountNumber(), request.getType(), start, end, pageable);
        } else if (hasType) {
            pageResult = repo.findByAccountNumberAndDirection(
                    request.getAccountNumber(), request.getType(), pageable);
        } else if (hasDate) {
            pageResult = repo.findByAccountNumberAndCreatedAtBetween(
                    request.getAccountNumber(), start, end, pageable);
        } else {
            pageResult = repo.findByAccountNumber(request.getAccountNumber(), pageable);
        }

        List<TransactionViewResponse> data = pageResult.stream().map(txn -> {

            String amount = txn.getDirection().equals("CREDIT")
                    ? "+₹" + txn.getAmount()
                    : "-₹" + txn.getAmount();

            return TransactionViewResponse.builder()
                    .name(txn.getDescription() != null ? txn.getDescription() : "Transaction")
                    .type(txn.getDirection().toLowerCase())
                    .amount(amount)
                    .status(txn.getStatus().equals("SUCCESS") ? "Completed" : "Failed")
                    .date(txn.getCreatedAt().toLocalDate().toString())
                    .build();

        }).toList();

        return ApiResponse.builder()
                .status("SUCCESS")
                .message("Transactions fetched")
                .data(data)
                .build();
    }

    private void save(String acc, String ref, Double amt,
                      String type, String dir, String status, String desc, Long senderId, Long receiverId) {

        repo.save(Transaction.builder()
                .transactionId(UUID.randomUUID().toString())
                .accountNumber(acc)
                .referenceAccount(ref)
                .amount(amt)
                .type(type)
                .direction(dir)
                .status(status)
                .description(desc)
                        .receiverUserId(receiverId)
                        .senderUserId(senderId)
                .createdAt(LocalDateTime.now())

                .build());
    }

    private ApiResponse<?> success(String msg) {
        return ApiResponse.builder()
                .status("SUCCESS")
                .message(msg)
                .build();
    }


    public ApiResponse<?> getTransactionsByUser(Long userId,
                                                int page,
                                                String searchText,
                                                String selectedType,
                                                String selectedMonth) {

        Pageable pageable = PageRequest.of(page, 5, Sort.by("createdAt").descending());

        Page<Transaction> pageResult =
                repo.findBySenderUserIdOrReceiverUserId(userId, userId, pageable);

        List<Transaction> filtered = pageResult.getContent();

        // ================= FILTER: TYPE =================
        if (selectedType != null
                && !selectedType.isEmpty()
                && !selectedType.equalsIgnoreCase("all")) {

            filtered = filtered.stream()
                    .filter(txn -> txn.getDirection().equalsIgnoreCase(selectedType))
                    .toList();
        }

        // ================= FILTER: SEARCH =================
        if (searchText != null && !searchText.isEmpty()) {
            filtered = filtered.stream()
                    .filter(txn ->
                            (txn.getDescription() != null &&
                                    txn.getDescription().toLowerCase().contains(searchText.toLowerCase()))
                    )
                    .toList();
        }

        // ================= FILTER: DATE =================
        if (selectedMonth != null
                && !selectedMonth.isEmpty()
                && !selectedMonth.equalsIgnoreCase("all")) {

            LocalDateTime now = LocalDateTime.now();

            filtered = filtered.stream().filter(txn -> {

                LocalDateTime txnDate = txn.getCreatedAt();

                switch (selectedMonth) {

                    case "last_7_days":
                        return txnDate.isAfter(now.minusDays(7));

                    case "this_month":
                        return txnDate.getMonth() == now.getMonth()
                                && txnDate.getYear() == now.getYear();

                    case "last_3_months":
                        return txnDate.isAfter(now.minusMonths(3));

                    default:
                        return true;
                }

            }).toList();
        }
        // ================= MAP TO RESPONSE =================
        List<TransactionViewResponse> data = filtered.stream().map(txn -> {

            String amount = txn.getDirection().equals("CREDIT")
                    ? "+₹" + txn.getAmount()
                    : "-₹" + txn.getAmount();

            return TransactionViewResponse.builder()
                    .name(txn.getDescription() != null ? txn.getDescription() : "Transaction")
                    .type(txn.getDirection().toLowerCase())
                    .amount(amount)
                    .status(txn.getStatus().equals("SUCCESS") ? "Completed" : "Failed")
                    .date(txn.getCreatedAt().toLocalDate().toString())
                    .build();

        }).toList();

        return ApiResponse.builder()
                .status("SUCCESS")
                .message("Transactions fetched")
                .data(data)
                .build();
    }
}