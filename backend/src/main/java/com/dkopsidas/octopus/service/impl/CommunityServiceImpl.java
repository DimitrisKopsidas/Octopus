package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CommunityActivityDto;
import com.dkopsidas.octopus.domain.dto.PublicUserDto;
import com.dkopsidas.octopus.domain.entity.DisplayPreference;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.repository.CommunityActivityRepository;
import com.dkopsidas.octopus.repository.CommunityRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.service.CommunityService;
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

@RequiredArgsConstructor
@Service
public class CommunityServiceImpl implements CommunityService {

    private static final int MAX_PAGE_SIZE = 50;
    private static final int MAX_QUERY_LENGTH = 50;

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityActivityRepository communityActivityRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<PublicUserDto> getProfile(String username) {
        return userRepository.findByUsernameIgnoreCase(username.trim())
                .filter(User::isActive)
                .map(user -> toDto(user, communityRepository.findStats(List.of(user.getId())).getFirst()));
    }

    @Override
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

    @Override
    @Transactional(readOnly = true)
    public PublicUserDto.Summary getSummary() {
        CommunityRepository.SummaryRow row = communityRepository.getSummary();
        return new PublicUserDto.Summary(
                row.getAdmins() + row.getHelpers() + row.getStudents(),
                row.getAdmins(), row.getHelpers(), row.getStudents(),
                row.getQuizzes(), row.getQuestions()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommunityActivityDto> getRecentActivity(int limit) {
        int cappedLimit = Math.clamp(limit > 0 ? limit : 20, 1, 50);
        return communityActivityRepository.findRecentActivities(PageRequest.of(0, cappedLimit)).stream()
                .map(ca -> new CommunityActivityDto(
                        ca.getId().toString(),
                        ca.getType(),
                        ca.getUser().getUsername(),
                        ca.getUser().getDisplayName(),
                        ca.getUser().getRole(),
                        ca.getBadgeCode(),
                        ca.getTier(),
                        null,
                        ca.getCreatedAt()
                ))
                .toList();
    }

    private static PublicUserDto toDto(User user, CommunityRepository.StatsRow s) {
        // Το discord βγαίνει μόνο αν ο χρήστης το διάλεξε ως όνομα. Το publicName() το χειρίζεται ήδη.
        boolean showDiscord = DisplayPreference.orDefault(user.getDisplayPreference()) == DisplayPreference.DISCORD_NAME
                && user.getDiscordName() != null && !user.getDiscordName().isBlank();

        return new PublicUserDto(
                user.getUsername(),
                user.publicName(),
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
