package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.dto.CreatePlayerRequestDto;
import com.dkopsidas.octopus.domain.dto.PlayerResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdatePlayerRequestDto;
import com.dkopsidas.octopus.domain.entity.Player;

public interface PlayerMapper {

    CreatePlayerRequest fromDto(CreatePlayerRequestDto dto);

    UpdatePlayerRequest fromDto(UpdatePlayerRequestDto dto);

    PlayerResponseDto toDto(Player player);
}
