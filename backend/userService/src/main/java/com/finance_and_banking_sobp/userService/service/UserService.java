package com.finance_and_banking_sobp.userService.service;

import com.finance_and_banking_sobp.userService.dto.*;
import com.finance_and_banking_sobp.userService.entity.UserEntity;
import com.finance_and_banking_sobp.userService.repository.UserRepo;
import com.finance_and_banking_sobp.userService.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private BCryptPasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    public UserResponse register(RegisterRequest registerRequest) {

        if (userRepo.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("email already exists");
        }
        UserEntity userEntity = new UserEntity();
        userEntity.setName(registerRequest.getName());
        userEntity.setEmail(registerRequest.getEmail());
        userEntity.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userEntity.setPhoneNumber(registerRequest.getPhoneNumber());

        UserEntity savedUser = userRepo.save(userEntity);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhoneNumber(),
                savedUser.getRole(),
                savedUser.getCreatedAt()
        );
    }

    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepo.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("user not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                token,
                "login successfull"
        );
    }

}