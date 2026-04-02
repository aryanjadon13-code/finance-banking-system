package com.finance_and_banking_sobp.userService.service;

import com.finance_and_banking_sobp.userService.dto.RegisterRequest;
import com.finance_and_banking_sobp.userService.dto.UserResponse;
import com.finance_and_banking_sobp.userService.entity.UserEntity;
import com.finance_and_banking_sobp.userService.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepo userRepo;

    public UserResponse register(RegisterRequest registerRequest){

        if (userRepo.findByEmail(registerRequest.getEmail()).isPresent()){
            throw  new RuntimeException("email already exists");
        }
        UserEntity userEntity=new UserEntity();
        userEntity.setName(registerRequest.getName());
        userEntity.setEmail(registerRequest.getEmail());
        userEntity.setPassword(registerRequest.getPassword());
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

}
