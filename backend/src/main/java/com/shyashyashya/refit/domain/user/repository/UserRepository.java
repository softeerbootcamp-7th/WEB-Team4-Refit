package com.shyashyashya.refit.domain.user.repository;

import com.shyashyashya.refit.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
