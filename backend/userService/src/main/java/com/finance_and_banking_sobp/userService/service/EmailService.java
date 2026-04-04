package com.finance_and_banking_sobp.userService.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.*;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpHtml(String toEmail, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Password Reset OTP");


            String htmlContent =
                    "<div style='font-family: Arial; padding:20px;'>"
                            + "<h2 style='color:#2c3e50;'>Finance Banking System</h2>"
                            + "<p>Hello User,</p>"
                            + "<p>Your OTP for password reset is:</p>"
                            + "<h1 style='color:#e74c3c;'>" + otp + "</h1>"
                            + "<p>This OTP is valid for 5 minutes.</p>"
                            + "<br>"
                            + "<p>Thank you,<br>Bank Team</p>"
                            + "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email");
        }
    }
}