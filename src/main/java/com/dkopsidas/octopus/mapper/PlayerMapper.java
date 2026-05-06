package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.dto.CreatePlayerRequestDto;
import com.dkopsidas.octopus.domain.dto.PlayerDto;
import com.dkopsidas.octopus.domain.dto.UpdatePlayerRequestDto;
import com.dkopsidas.octopus.domain.entity.Player;

public interface PlayerMapper {

    CreatePlayerRequest fromDto(CreatePlayerRequestDto dto);

    UpdatePlayerRequest fromDto(UpdatePlayerRequestDto dto);

    PlayerDto toDto(Player player);
}
