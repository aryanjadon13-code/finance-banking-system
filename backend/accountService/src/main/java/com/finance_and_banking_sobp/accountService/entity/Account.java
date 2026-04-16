package com.finance_and_banking_sobp.accountService.entity;


import com.finance_and_banking_sobp.accountService.models.AccountType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    private Double balance;

    private Long userId;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String branchName;

    @Column(nullable = false)
    private String currency ;

    private String status;
}
