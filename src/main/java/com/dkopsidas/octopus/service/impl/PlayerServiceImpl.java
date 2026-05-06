package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.entity.Player;
import com.dkopsidas.octopus.domain.entity.PlayerType;
import com.dkopsidas.octopus.exception.PlayerNotFoundException;
import com.dkopsidas.octopus.repository.PlayerRepository;
import com.dkopsidas.octopus.service.PlayerService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerServiceImpl(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public Player createPlayer(CreatePlayerRequest request) {
        Instant now = Instant.now();

        Player player = new Player(
                null,
                request.name(),
                request.password(),
                request.year(),
                PlayerType.STANDARD,
                now,
                now
        );

        return playerRepository.save(player);
    }

    @Override
    public List<Player> listPlayers() {
        return playerRepository.findAll(Sort.by(Sort.Direction.ASC, "created"));
    }

    @Override
    public Player updatePlayer(UUID playerId, UpdatePlayerRequest request) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new PlayerNotFoundException((playerId)));

        player.setName(request.name());
        player.setPassword(request.password());
        player.setYear(request.year());
        player.setType(request.type());
        player.setUpdated(Instant.now());

        return playerRepository.save(player);
    }

    @Override
    public void deletePlayer(UUID playerId) {
        playerRepository.deleteById(playerId);
    }
}
