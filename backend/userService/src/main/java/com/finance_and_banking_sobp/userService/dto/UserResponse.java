package com.finance_and_banking_sobp.userService.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private LocalDateTime createdAt;
}