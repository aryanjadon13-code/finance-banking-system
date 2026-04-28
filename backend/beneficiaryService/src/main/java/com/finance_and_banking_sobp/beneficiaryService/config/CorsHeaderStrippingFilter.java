package com.finance_and_banking_sobp.beneficiaryService.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Strips all CORS headers from outgoing responses.
 * CORS is handled centrally by the API Gateway.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsHeaderStrippingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        chain.doFilter(request, response);

        HttpServletResponse httpResponse = (HttpServletResponse) response;
        httpResponse.setHeader("Access-Control-Allow-Origin", null);
        httpResponse.setHeader("Access-Control-Allow-Credentials", null);
        httpResponse.setHeader("Access-Control-Allow-Methods", null);
        httpResponse.setHeader("Access-Control-Allow-Headers", null);
        httpResponse.setHeader("Access-Control-Expose-Headers", null);
    }
}
