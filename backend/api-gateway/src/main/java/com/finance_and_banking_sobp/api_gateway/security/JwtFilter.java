package com.finance_and_banking_sobp.api_gateway.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtFilter implements GlobalFilter {

    private final JwtUtil jwtUtil;


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        System.out.println("Incoming request: " + path);

        // ✅ Allow preflight requests (CORS)
        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        // ✅ Public endpoints (NO AUTH)
        if (isPublicEndpoint(path)) {
            return chain.filter(exchange);
        }

        // 🔐 Get Authorization header
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        try {
            // 🔍 Validate token
            if (!jwtUtil.validateToken(token)) {
                return unauthorized(exchange, "Invalid or expired token");
            }

            // ✅ Extract userId
            Claims claims = jwtUtil.extractClaims(token);
            String userId = claims.get("userId").toString();

            // ✅ Pass userId to downstream services
            exchange = exchange.mutate()
                    .request(r -> r.header("user-id", userId))
                    .build();

        } catch (Exception e) {
            return unauthorized(exchange, "Token validation failed");
        }

        return chain.filter(exchange);
    }

    // 🔓 Public APIs
    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/users/login") ||
                path.startsWith("/api/users/register") ||
                path.startsWith("/api/users/forgot-password") ||
                path.startsWith("/api/users/verify-otp") ||
                path.startsWith("/api/users/reset-password");
    }

    // ❌ Unauthorized response
    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {

        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);

        byte[] bytes = message.getBytes();

        DataBuffer buffer = exchange.getResponse()
                .bufferFactory()
                .wrap(bytes);

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}