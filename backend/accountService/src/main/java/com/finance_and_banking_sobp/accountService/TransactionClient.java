package com.finance_and_banking_sobp.accountService;



import com.finance_and_banking_sobp.accountService.dto.TransactionRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "TRANSACTIONSERVICE")
public interface TransactionClient {


    @PostMapping("/api/transactions/deposit")
    void deposit(TransactionRequest request);

    @PostMapping("/api/transactions/record")
    void record(TransactionRequest request);
}
