package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.dto.CreatePlayerRequestDto;
import com.dkopsidas.octopus.domain.dto.PlayerDto;
import com.dkopsidas.octopus.domain.dto.UpdatePlayerRequestDto;
import com.dkopsidas.octopus.domain.entity.Player;
import com.dkopsidas.octopus.mapper.PlayerMapper;
import com.dkopsidas.octopus.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/players")
public class PlayerController {

    private final PlayerService playerService;
    private final PlayerMapper playerMapper;

    @PostMapping
    public ResponseEntity<PlayerDto> createPlayer(
            @Valid @RequestBody CreatePlayerRequestDto createPlayerRequestDto
    ) {
        CreatePlayerRequest createPlayerRequest= playerMapper.fromDto(createPlayerRequestDto);
        Player player = playerService.createPlayer(createPlayerRequest);//to service layer
        PlayerDto createdPlayerDto = playerMapper.toDto(player);//back to dto to return as response
        return new ResponseEntity<>(createdPlayerDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PlayerDto>> listPlayers() {
        List<Player> players = playerService.listPlayers();
        List<PlayerDto> playerDtos = players.stream().map(playerMapper::toDto).toList();
        return ResponseEntity.ok(playerDtos);
    }

    @PutMapping(path = "/{playerId}")
    public ResponseEntity<PlayerDto> updatePlayer(
            @PathVariable UUID playerId,
            @Valid @RequestBody UpdatePlayerRequestDto updatePlayerRequestDto
    ) {
        UpdatePlayerRequest updatePlayerRequest = playerMapper.fromDto(updatePlayerRequestDto);
        Player player = playerService.updatePlayer(playerId, updatePlayerRequest);
        PlayerDto playerDto = playerMapper.toDto(player);
        return ResponseEntity.ok(playerDto);
    }

    public ResponseEntity<Void> deletePlayer (@PathVariable UUID playerId) {
        playerService.deletePlayer(playerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
