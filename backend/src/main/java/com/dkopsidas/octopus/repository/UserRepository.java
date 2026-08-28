package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    boolean existsByUsernameIgnoreCase(String username);

    Optional<User> findByUsernameIgnoreCase(String username);

    long countByActiveTrue();
}
