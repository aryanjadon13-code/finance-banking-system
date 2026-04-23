package com.finance_and_banking_sobp.accountService.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        // ✅ Allow your Angular app
        config.setAllowedOrigins(List.of("http://localhost:4200"));

        // ✅ Allow all headers
        config.setAllowedHeaders(List.of("*"));

        // ✅ Allow all HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ Apply config to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
