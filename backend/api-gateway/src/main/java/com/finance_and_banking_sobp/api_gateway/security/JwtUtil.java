package com.finance_and_banking_sobp.api_gateway.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    private final String SECRET = "my-secret-key-my-secret-key-12345";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ✅ Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.out.println("JWT validation failed: " + e.getMessage());
            return false;
        }
    }

    // ✅ Extract claims (userId, email, etc.)
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}