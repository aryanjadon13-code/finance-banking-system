package com.finance_and_banking_sobp.userService.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;

    @Size(min = 6)
    private String newPassword;
}
