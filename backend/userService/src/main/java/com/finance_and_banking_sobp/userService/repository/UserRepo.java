package com.finance_and_banking_sobp.userService.repository;

import com.finance_and_banking_sobp.userService.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEntity,Long>{

    Optional<UserEntity> findByEmail(String email);
}
