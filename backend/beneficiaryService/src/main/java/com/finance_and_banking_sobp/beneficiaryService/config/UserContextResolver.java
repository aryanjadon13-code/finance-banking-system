package com.finance_and_banking_sobp.beneficiaryService.config;

import com.finance_and_banking_sobp.beneficiaryService.exception.UnauthorizedAccessException;
import com.finance_and_banking_sobp.beneficiaryService.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserContextResolver {

    private final JwtUtil jwtUtil;

    public RequestUserContext resolve(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedAccessException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        String email = jwtUtil.extractEmail(token);

        return new RequestUserContext(userId, email);
    }
}
