package com.finance_and_banking_sobp.beneficiaryService.service;

import com.finance_and_banking_sobp.beneficiaryService.dto.BeneficiaryRequest;
import com.finance_and_banking_sobp.beneficiaryService.dto.BeneficiaryResponse;

import java.util.List;

public interface BeneficiaryService {

    BeneficiaryResponse addBeneficiary(Long userId, BeneficiaryRequest request);

    List<BeneficiaryResponse> getBeneficiaries(Long userId);

    void deleteBeneficiary(Long userId, Long beneficiaryId);
}
