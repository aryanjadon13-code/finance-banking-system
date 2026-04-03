package com.finance_and_banking_sobp.userService.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private Long userId;
    private String email;
    private String token;
    private String message;
}
