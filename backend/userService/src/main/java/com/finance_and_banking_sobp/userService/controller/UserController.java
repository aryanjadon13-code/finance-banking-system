package com.finance_and_banking_sobp.userService.controller;

import com.finance_and_banking_sobp.userService.dto.RegisterRequest;
import com.finance_and_banking_sobp.userService.dto.UserResponse;
import com.finance_and_banking_sobp.userService.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

  private UserService userService;

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }
}
