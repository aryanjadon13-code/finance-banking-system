package com.finance_and_banking_sobp.transactionService.repository;

import com.finance_and_banking_sobp.transactionService.entity.Transaction;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByAccountNumber(String accountNumber, Pageable pageable);

    Page<Transaction> findByAccountNumberAndDirection(
            String accountNumber, String direction, Pageable pageable);

    Page<Transaction> findByAccountNumberAndCreatedAtBetween(
            String accountNumber, LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<Transaction> findByAccountNumberAndDirectionAndCreatedAtBetween(
            String accountNumber, String direction,
            LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<Transaction> findBySenderUserIdOrReceiverUserId(
            Long senderUserId,
            Long receiverUserId,
            Pageable pageable
    );
}