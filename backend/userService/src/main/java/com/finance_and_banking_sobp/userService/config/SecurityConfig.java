package com.finance_and_banking_sobp.userService.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                //  disable CSRF
                .csrf(csrf -> csrf.disable())

                //  allow everything (gateway will secure)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                .build();
    }
}