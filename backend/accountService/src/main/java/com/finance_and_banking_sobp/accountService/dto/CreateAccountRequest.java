package com.finance_and_banking_sobp.accountService.dto;


import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateAccountRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String accountType;

    @NotBlank
    private String branchName;

    @NotBlank
    private String nomineeName;

    @NotBlank
    private String pin;

    @NotNull
    @Min(value = 500, message = "Minimum deposit is 500")
    private Double initialDeposit;
}