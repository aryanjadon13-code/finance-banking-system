package com.finance_and_banking_sobp.accountService.entity;


import com.finance_and_banking_sobp.accountService.models.AccountType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    private Double balance;

    private String branchName;

    private String currency;

    private String status;

    private String nomineeName;

    private String pin;

    private Long userId;

    private LocalDateTime createdAt;
}