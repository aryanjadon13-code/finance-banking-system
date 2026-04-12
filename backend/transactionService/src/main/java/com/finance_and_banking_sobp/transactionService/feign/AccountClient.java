package com.finance_and_banking_sobp.transactionService.feign;

import com.finance_and_banking_sobp.transactionService.dto.AccountResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ACCOUNTSERVICE")
public interface AccountClient {

    @PutMapping("/api/accounts/{accountNumber}/balance")
    void updateBalance(@PathVariable String accountNumber,
                       @RequestParam Double amount);

    @GetMapping("/api/accounts/{accountNumber}")
    AccountResponse getAccount(@PathVariable String accountNumber);

}
