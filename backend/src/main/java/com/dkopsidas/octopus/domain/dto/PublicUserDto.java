package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.UserRole;

import java.time.Instant;

/**
 * What anyone, signed in or not, may see about a user (profiles + Community).
 * Narrower than UserResponseDto: no id, no active flag, and discordName only
 * when the user chose to be shown by it. Badges are worked out by the frontend
 * from these stats (lib/badges.js); only "og" needs the database.
 *
 * @param og one of the first 50 users ever registered
 */
public record PublicUserDto(
        String username,
        String name,
        String discordName,
        UserRole role,
        Integer year,
        Instant memberSince,
        boolean og,
        Stats stats
) {
    /**
     * @param avgScore    percent of correct answers over all quizzes, null if none yet
     * @param perfectQuizzes quizzes finished with every answer correct
     * @param nightOwlQuizzes quizzes finished between 02:00 and 05:00 Athens time
     */
    public record Stats(
            long quizzesCompleted,
            Double avgScore,
            long questionsCreated,
            long coursesPracticed,
            long perfectQuizzes,
            long nightOwlQuizzes
    ) {}

    /** Headline numbers for the Community hero. Active users only. */
    public record Summary(
            long members,
            long admins,
            long helpers,
            long students,
            long quizzesCompleted,
            long questionsCreated
    ) {}
}
