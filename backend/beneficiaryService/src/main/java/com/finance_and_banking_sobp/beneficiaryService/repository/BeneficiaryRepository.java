package com.finance_and_banking_sobp.beneficiaryService.repository;

import com.finance_and_banking_sobp.beneficiaryService.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Beneficiary> findByIdAndUserId(Long id, Long userId);

    Optional<Beneficiary> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);
}
