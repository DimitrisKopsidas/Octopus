package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
}
