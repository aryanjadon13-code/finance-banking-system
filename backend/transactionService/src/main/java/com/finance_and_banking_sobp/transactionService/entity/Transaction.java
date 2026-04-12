package com.finance_and_banking_sobp.transactionService.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String transactionId;

        private String accountNumber;

        private String referenceAccount;

        private String type;

        private String direction;

        private Double amount;

        private String status;

        private LocalDateTime createdAt;
    }


