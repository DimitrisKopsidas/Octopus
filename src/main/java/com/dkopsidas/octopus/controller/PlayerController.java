package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.dto.CreatePlayerRequestDto;
import com.dkopsidas.octopus.domain.dto.PlayerResponseDto;
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
    public ResponseEntity<PlayerResponseDto> createPlayer(
            @Valid @RequestBody CreatePlayerRequestDto createPlayerRequestDto
    ) {
        CreatePlayerRequest createPlayerRequest= playerMapper.fromDto(createPlayerRequestDto);
        Player player = playerService.createPlayer(createPlayerRequest);//to service layer
        PlayerResponseDto createdPlayerResponseDto = playerMapper.toDto(player);//back to dto to return as response
        return new ResponseEntity<>(createdPlayerResponseDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PlayerResponseDto>> listPlayers() {
        List<Player> players = playerService.listPlayers();
        List<PlayerResponseDto> playerResponseDtos = players.stream().map(playerMapper::toDto).toList();
        return ResponseEntity.ok(playerResponseDtos);
    }

    @PutMapping(path = "/{playerId}")
    public ResponseEntity<PlayerResponseDto> updatePlayer(
            @PathVariable UUID playerId,
            @Valid @RequestBody UpdatePlayerRequestDto updatePlayerRequestDto
    ) {
        UpdatePlayerRequest updatePlayerRequest = playerMapper.fromDto(updatePlayerRequestDto);
        Player player = playerService.updatePlayer(playerId, updatePlayerRequest);
        PlayerResponseDto playerResponseDto = playerMapper.toDto(player);
        return ResponseEntity.ok(playerResponseDto);
    }

    public ResponseEntity<Void> deletePlayer (@PathVariable UUID playerId) {
        playerService.deletePlayer(playerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
