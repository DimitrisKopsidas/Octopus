package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.PublicUserDto;
import com.dkopsidas.octopus.domain.entity.DisplayPreference;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.repository.CommunityRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Public profiles and the Community directory. Everything here is public: active users only. */
@RequiredArgsConstructor
@Service
public class CommunityService {

    private static final int MAX_PAGE_SIZE = 50;
    private static final int MAX_QUERY_LENGTH = 50;

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;

    @Transactional(readOnly = true)
    public Optional<PublicUserDto> getProfile(String username) {
        return userRepository.findByUsernameIgnoreCase(username.trim())
                .filter(User::isActive)
                .map(user -> toDto(user, communityRepository.findStats(List.of(user.getId())).getFirst()));
    }

    @Transactional(readOnly = true)
    public Page<PublicUserDto> search(String role, Integer year, String query, String sort, int page, int size) {
        Page<User> users = communityRepository.search(
                role != null ? role.trim().toUpperCase(Locale.ROOT) : "",
                year != null ? year : 0,
                likePattern(query),
                sort != null ? sort : "newest",
                PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, MAX_PAGE_SIZE))
        );
        Map<UUID, CommunityRepository.StatsRow> stats = users.isEmpty() ? Map.of()
                : communityRepository.findStats(users.map(User::getId).getContent()).stream()
                        .collect(Collectors.toMap(CommunityRepository.StatsRow::getUserId, Function.identity()));

        return users.map(user -> toDto(user, stats.get(user.getId())));
    }

    @Transactional(readOnly = true)
    public PublicUserDto.Summary getSummary() {
        CommunityRepository.SummaryRow row = communityRepository.getSummary();
        return new PublicUserDto.Summary(
                row.getAdmins() + row.getHelpers() + row.getStudents(),
                row.getAdmins(), row.getHelpers(), row.getStudents(),
                row.getQuizzes(), row.getQuestions()
        );
    }

    private static PublicUserDto toDto(User user, CommunityRepository.StatsRow s) {
        // publicName() carries the Discord handle, so only use it when the user picked Discord.
        boolean showDiscord = DisplayPreference.orDefault(user.getDisplayPreference()) == DisplayPreference.DISCORD_NAME
                && user.getDiscordName() != null && !user.getDiscordName().isBlank();

        return new PublicUserDto(
                user.getUsername(),
                showDiscord ? user.publicName() : user.getDisplayName(),
                showDiscord ? user.getDiscordName() : null,
                user.getRole(),
                user.getYear(),
                user.getCreated(),
                Boolean.TRUE.equals(s.getOg()),
                new PublicUserDto.Stats(
                        s.getQuizzes(), s.getAvgScore(), s.getQuestions(), s.getCourses(),
                        s.getPerfect(), s.getNightOwl()
                )
        );
    }

    /**
     * '' = no filter; otherwise a contains-match with LIKE wildcards escaped.
     * Capped in length: this endpoint is public, and no real name is that long.
     */
    private static String likePattern(String query) {
        if (query == null || query.isBlank()) {
            return "";
        }
        String trimmed = query.trim();
        if (trimmed.length() > MAX_QUERY_LENGTH) {
            trimmed = trimmed.substring(0, MAX_QUERY_LENGTH);
        }
        return "%" + trimmed.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
    }
}
