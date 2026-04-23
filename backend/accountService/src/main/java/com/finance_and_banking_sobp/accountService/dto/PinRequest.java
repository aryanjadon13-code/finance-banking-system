package com.finance_and_banking_sobp.accountService.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PinRequest {
    private String accountNumber;
    @Pattern(regexp = "\\d{4}", message = "PIN must be exactly 4 digits")
    private String pin;
}
