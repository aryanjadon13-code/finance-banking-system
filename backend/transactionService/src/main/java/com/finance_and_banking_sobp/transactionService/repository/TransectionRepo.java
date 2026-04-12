package com.finance_and_banking_sobp.transactionService.repository;


import com.finance_and_banking_sobp.transactionService.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransectionRepo extends JpaRepository<Transaction,Long> {

    List<Transaction> findByAccountNumber(String accountNumber);
}
