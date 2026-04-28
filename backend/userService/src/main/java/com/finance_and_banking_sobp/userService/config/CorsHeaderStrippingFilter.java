package com.finance_and_banking_sobp.userService.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsHeaderStrippingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Remove CORS headers if they were added by other parts of the app
        // This ensures ONLY the API Gateway manages CORS
        httpResponse.setHeader("Access-Control-Allow-Origin", null);
        httpResponse.setHeader("Access-Control-Allow-Methods", null);
        httpResponse.setHeader("Access-Control-Allow-Headers", null);
        httpResponse.setHeader("Access-Control-Allow-Credentials", null);
        
        chain.doFilter(request, response);
    }
}
