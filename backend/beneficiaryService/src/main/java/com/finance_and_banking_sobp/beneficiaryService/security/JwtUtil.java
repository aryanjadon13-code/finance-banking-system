package com.finance_and_banking_sobp.beneficiaryService.security;

import com.finance_and_banking_sobp.beneficiaryService.exception.UnauthorizedAccessException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    private static final String SECRET = "my-secret-key-my-secret-key-12345";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        Object userId = getClaims(token).get("userId");
        if (userId == null) {
            throw new UnauthorizedAccessException("Token does not contain user information");
        }

        if (userId instanceof Integer integerValue) {
            return integerValue.longValue();
        }

        if (userId instanceof Long longValue) {
            return longValue;
        }

        return Long.parseLong(String.valueOf(userId));
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception ex) {
            throw new UnauthorizedAccessException("Invalid or expired token");
        }
    }
}
