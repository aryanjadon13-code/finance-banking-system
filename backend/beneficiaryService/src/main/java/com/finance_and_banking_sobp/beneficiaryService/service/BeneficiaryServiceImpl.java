package com.finance_and_banking_sobp.beneficiaryService.service;

import com.finance_and_banking_sobp.beneficiaryService.dto.BeneficiaryRequest;
import com.finance_and_banking_sobp.beneficiaryService.dto.BeneficiaryResponse;
import com.finance_and_banking_sobp.beneficiaryService.entity.Beneficiary;
import com.finance_and_banking_sobp.beneficiaryService.exception.BeneficiaryNotFoundException;
import com.finance_and_banking_sobp.beneficiaryService.exception.DuplicateBeneficiaryException;
import com.finance_and_banking_sobp.beneficiaryService.repository.BeneficiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    @Override
    public BeneficiaryResponse addBeneficiary(Long userId, BeneficiaryRequest request) {
        String normalizedName = request.getName().trim();
        String normalizedAccountNumber = request.getAccountNumber().trim();
        String normalizedBankName = request.getBankName().trim();
        String normalizedIfscCode = request.getIfscCode().trim().toUpperCase();

        if (beneficiaryRepository.existsByAccountNumber(normalizedAccountNumber)) {
            throw new DuplicateBeneficiaryException("User with this account number already exists");
        }

        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setName(normalizedName);
        beneficiary.setAccountNumber(normalizedAccountNumber);
        beneficiary.setBankName(normalizedBankName);
        beneficiary.setIfscCode(normalizedIfscCode);
        beneficiary.setUserId(userId);

        return mapToResponse(beneficiaryRepository.save(beneficiary));
    }

    @Override
    public List<BeneficiaryResponse> getBeneficiaries(Long userId) {
        return beneficiaryRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteBeneficiary(Long userId, Long beneficiaryId) {
        Beneficiary beneficiary = beneficiaryRepository.findByIdAndUserId(beneficiaryId, userId)
                .orElseThrow(() -> new BeneficiaryNotFoundException("Beneficiary not found for the logged-in user"));

        beneficiaryRepository.delete(beneficiary);
    }

    private BeneficiaryResponse mapToResponse(Beneficiary beneficiary) {
        return BeneficiaryResponse.builder()
                .id(beneficiary.getId())
                .name(beneficiary.getName())
                .accountNumber(beneficiary.getAccountNumber())
                .bankName(beneficiary.getBankName())
                .ifscCode(beneficiary.getIfscCode())
                .userId(beneficiary.getUserId())
                .createdAt(beneficiary.getCreatedAt())
                .build();
    }
}
