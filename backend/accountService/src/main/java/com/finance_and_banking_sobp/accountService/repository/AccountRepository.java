package com.finance_and_banking_sobp.accountService.repository;


import com.finance_and_banking_sobp.accountService.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);
}