package com.finance_and_banking_sobp.accountService.dto;

import com.finance_and_banking_sobp.accountService.models.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class CreateAccountRequest {

//    @NotNull
//    private Long userId;

    private AccountType accountType;

    @NotBlank(message = "Branch name is required")
    private String branchName;

    private String currency;

    @NotNull
    @Positive(message = "Initial Deposit must be greater than 0 ")
    private Double initialDeposit;
}
