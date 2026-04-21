package com.finance_and_banking_sobp.transactionService.repository;


import com.finance_and_banking_sobp.transactionService.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransectionRepo extends JpaRepository<Transaction,Long> {

    List<Transaction> findByAccountNumber(String accountNumber);
//    List<Transaction> findByAccountNumberOrderByCreatedAtDesc(String accountNumber);
//
//    List<Transaction> findByAccountNumberAndDirectionOrderByCreatedAtDesc(
//            String accountNumber, String direction);
//
//    List<Transaction> findByAccountNumberAndCreatedAtBetweenOrderByCreatedAtDesc(
//            String accountNumber, LocalDateTime from, LocalDateTime to);
//
//    List<Transaction> findByAccountNumberAndDirectionAndCreatedAtBetweenOrderByCreatedAtDesc(
//            String accountNumber, String direction, LocalDateTime from, LocalDateTime to);


}
