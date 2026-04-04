package com.finance_and_banking_sobp.userService.controller;

import com.finance_and_banking_sobp.userService.dto.*;
import com.finance_and_banking_sobp.userService.service.OtpService;
import com.finance_and_banking_sobp.userService.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

  private UserService userService;
  private OtpService otpService;

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login (@Valid @RequestBody LoginRequest request){
        return userService.login(request);
    }

    @GetMapping("/test")
    public String test() {
        return "secured API working";
    }

//    otp controllers

    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return otpService.forgotPassword(request);
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {
        return otpService.verifyOtp(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        return otpService.resetPassword(request);
    }
}
