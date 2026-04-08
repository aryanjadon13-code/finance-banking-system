package com.finance_and_banking_sobp.accountService.dto;


import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

@Data
public class CreateAccountRequest {

    @NotNull
    private Long userId;

    @NotNull
    private String accountType;
}
