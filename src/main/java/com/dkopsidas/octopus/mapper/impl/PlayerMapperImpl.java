package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.dto.CreatePlayerRequestDto;
import com.dkopsidas.octopus.domain.dto.PlayerDto;
import com.dkopsidas.octopus.domain.dto.UpdatePlayerRequestDto;
import com.dkopsidas.octopus.domain.entity.Player;
import com.dkopsidas.octopus.mapper.PlayerMapper;
import org.springframework.stereotype.Component;

@Component
public class PlayerMapperImpl implements PlayerMapper {
    @Override
    public CreatePlayerRequest fromDto(CreatePlayerRequestDto dto) {
        return new CreatePlayerRequest(
                dto.name(),
                dto.password(),
                dto.year()
        );
    }

    @Override
    public UpdatePlayerRequest fromDto(UpdatePlayerRequestDto dto) {
        return new UpdatePlayerRequest(
                dto.name(),
                dto.password(),
                dto.year(),
                dto.type()
        );
    }

    @Override
    public PlayerDto toDto(Player player) {
        return new PlayerDto(
            player.getId(),
            player.getName(),
            player.getPassword(),
            player.getYear(),
            player.getType()
        );
    }
}
