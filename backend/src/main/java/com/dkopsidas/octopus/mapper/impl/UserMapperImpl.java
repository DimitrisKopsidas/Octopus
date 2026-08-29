package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.DisplayPreference;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.mapper.UserMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(CreateUserRequestDto dto, String passwordHash, UserRole role) {
        User user = new User();
        String username = dto.username().trim();
        user.setUsername(username);
        String displayName = dto.displayName();
        user.setDisplayName(displayName != null && !displayName.isBlank()
                ? displayName.trim()
                : username);
        user.setPasswordHash(passwordHash);
        user.setYear(dto.year());
        user.setDiscordName(dto.discordName() != null ? dto.discordName().trim() : null);
        user.setRole(role != null ? role : UserRole.STUDENT);
        user.setActive(true);

        return user;
    }

    @Override
    public UserResponseDto toDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getYear(),
                user.getDiscordName(),
                DisplayPreference.orDefault(user.getDisplayPreference()),
                resolvePublicName(user),
                user.getRole(),
                user.isActive(),
                user.getCreated(),
                user.getUpdated()
        );
    }

    /**
     * The name every public surface should print. Falls back to the display name
     * when Discord is the pick but no handle was ever filled in, so a leaderboard
     * row can never come out blank.
     */
    private String resolvePublicName(User user) {
        boolean wantsDiscord =
                DisplayPreference.orDefault(user.getDisplayPreference()) == DisplayPreference.DISCORD_NAME;
        String discordName = user.getDiscordName();

        return wantsDiscord && discordName != null && !discordName.isBlank()
                ? discordName
                : user.getDisplayName();
    }
}
