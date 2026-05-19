package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.entity.Player;

import java.util.List;
import java.util.UUID;

public interface PlayerService {

    Player createPlayer(CreatePlayerRequest request);

    List<Player> listPlayers();

    Player updatePlayer(UUID playerId, UpdatePlayerRequest request);

    void deletePlayer(UUID playerId);

}
