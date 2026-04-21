package com.finance_and_banking_sobp.beneficiaryService.controller;

import com.finance_and_banking_sobp.beneficiaryService.config.RequestUserContext;
import com.finance_and_banking_sobp.beneficiaryService.config.UserContextResolver;
import com.finance_and_banking_sobp.beneficiaryService.dto.BeneficiaryRequest;
import com.finance_and_banking_sobp.beneficiaryService.dto.BeneficiaryResponse;
import com.finance_and_banking_sobp.beneficiaryService.service.BeneficiaryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;
    private final UserContextResolver userContextResolver;

    @PostMapping
    public ResponseEntity<BeneficiaryResponse> addBeneficiary(
            @Valid @RequestBody BeneficiaryRequest request,
            HttpServletRequest httpServletRequest
    ) {
        RequestUserContext userContext = userContextResolver.resolve(httpServletRequest);
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(userContext.getUserId(), request));
    }

    @GetMapping
    public ResponseEntity<List<BeneficiaryResponse>> getBeneficiaries(HttpServletRequest httpServletRequest) {
        RequestUserContext userContext = userContextResolver.resolve(httpServletRequest);
        return ResponseEntity.ok(beneficiaryService.getBeneficiaries(userContext.getUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBeneficiary(
            @PathVariable Long id,
            HttpServletRequest httpServletRequest
    ) {
        RequestUserContext userContext = userContextResolver.resolve(httpServletRequest);
        beneficiaryService.deleteBeneficiary(userContext.getUserId(), id);
        return ResponseEntity.ok(Map.of("message", "Beneficiary deleted successfully"));
    }
}
