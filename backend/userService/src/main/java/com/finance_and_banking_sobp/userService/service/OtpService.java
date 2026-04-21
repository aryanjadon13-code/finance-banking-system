package com.finance_and_banking_sobp.userService.service;

import com.finance_and_banking_sobp.userService.dto.ForgotPasswordRequest;
import com.finance_and_banking_sobp.userService.dto.ResetPasswordRequest;
import com.finance_and_banking_sobp.userService.dto.VerifyOtpRequest;
import com.finance_and_banking_sobp.userService.entity.UserEntity;
import com.finance_and_banking_sobp.userService.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@AllArgsConstructor
public class OtpService {
    private final UserRepo userRepo;
    private BCryptPasswordEncoder passwordEncoder;
    private EmailService emailService;

    private String generateOtp() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    public ResponseEntity<Map<String, String>> forgotPassword(ForgotPasswordRequest request) {

        UserEntity user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setOtpVerified(false);

        userRepo.save(user);

        try {
            emailService.sendOtpHtml(user.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email");
        }
        return ResponseEntity.ok(Map.of("message", "otp sent to your email"));

    }

    public ResponseEntity<Map<String, String>> verifyOtp(VerifyOtpRequest request){
        UserEntity user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.getOtp().equals(request.getOtp())){
            throw new RuntimeException("Ivalid OTP");
        }
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())){
            throw new RuntimeException("OTP expired");
        }

        user.setOtpVerified(true);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "otp verified successfully"));
    }

    public ResponseEntity<?> resetPassword (ResetPasswordRequest request){
      UserEntity user=  userRepo.findByEmail(request.getEmail()).orElseThrow(()->new RuntimeException("user not found"));

        if (!Boolean.TRUE.equals(user.getOtpVerified())) {
            throw new RuntimeException("otp not verified");
        }
      user.setPassword(passwordEncoder.encode(request.getNewPassword()));

      user.setOtp(null);
      user.setOtpExpiry(null);
      user.setOtpVerified(false);

      userRepo.save(user);

      return  ResponseEntity.ok(Map.of("message", "password reset successfull"));
    }
}
