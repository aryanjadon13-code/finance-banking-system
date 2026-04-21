package com.finance_and_banking_sobp.beneficiaryService.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RequestUserContext {

    private final Long userId;
    private final String email;
}
