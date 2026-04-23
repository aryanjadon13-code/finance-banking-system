package com.finance_and_banking_sobp.transactionService.feign;

import com.finance_and_banking_sobp.transactionService.dto.PinRequest;
import com.finance_and_banking_sobp.transactionService.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "account-service", url = "http://localhost:8082")
public interface AccountClient {

    @GetMapping("/api/accounts/{accountNumber}")
    AccountResponse getAccount(@PathVariable String accountNumber);

    @PutMapping("/api/accounts/{accountNumber}/balance")
    void updateBalance(@PathVariable String accountNumber,
                       @RequestParam Double amount);

    @PostMapping("/api/accounts/validate-pin")
    void validatePin(@RequestBody PinRequest request);
}