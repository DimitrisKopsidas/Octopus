package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Read-only queries behind public profiles and the Community page.
 * Filters use '' / 0 for "any": a null bound into a native Postgres query has
 * no type, so "IS NULL" on it fails to plan.
 */
public interface CommunityRepository extends Repository<User, UUID> {

    String FILTER = """
            u.active = true
              AND (:role = '' OR u.role = :role)
              AND (:year = 0 OR u.year = :year)
              AND (:q = '' OR u.username ILIKE :q OR u.display_name ILIKE :q)
            """;

    /** @param sort newest | oldest | name | quizzes | questions (anything else = newest) */
    @Query(value = """
            SELECT u.* FROM users u
            WHERE
            """ + FILTER + """
            ORDER BY
                CASE WHEN :sort = 'quizzes' THEN (SELECT COUNT(*) FROM quiz_attempts qa
                    WHERE qa.user_id = u.id AND qa.finished_at IS NOT NULL) END DESC,
                CASE WHEN :sort = 'questions' THEN (SELECT COUNT(*) FROM questions q WHERE q.created_by = u.id AND q.is_active = true) END DESC,
                CASE WHEN :sort = 'oldest' THEN u.created END ASC,
                CASE WHEN :sort = 'name' THEN lower(u.display_name) END ASC,
                u.created DESC, u.username
            """,
            countQuery = "SELECT COUNT(*) FROM users u WHERE " + FILTER,
            nativeQuery = true)
    Page<User> search(@Param("role") String role, @Param("year") int year, @Param("q") String q,
                      @Param("sort") String sort, Pageable pageable);

    interface StatsRow {
        UUID getUserId();
        Long getQuizzes();
        Double getAvgScore();
        Long getPerfect();
        Long getNightOwl();
        Long getQuestions();
        Long getCourses();
        Boolean getOg();
    }

    /**
     * Everything a profile shows, for a batch of users in one query. Quiz stats come from
     * submitted quiz_attempts only: bundles don't store skipped questions, so their scores are wrong.
     * "perfect" = every served question correct, in a quiz of at least 10 questions.
     * Only active questions count towards "questions" (soft-deleted ones don't).
     */
    @Query(value = """
            WITH a AS (
                SELECT user_id, course_id, question_count, correct_count, finished_at
                FROM quiz_attempts
                WHERE user_id IN (:ids) AND finished_at IS NOT NULL
            )
            SELECT u.id AS "userId",
                (SELECT COUNT(*) FROM a WHERE a.user_id = u.id) AS "quizzes",
                (SELECT AVG(a.correct_count * 100.0 / a.question_count) FROM a WHERE a.user_id = u.id)::double precision AS "avgScore",
                (SELECT COUNT(*) FROM a WHERE a.user_id = u.id
                    AND a.question_count >= 10 AND a.correct_count = a.question_count) AS "perfect",
                (SELECT COUNT(*) FROM a WHERE a.user_id = u.id
                    AND EXTRACT(HOUR FROM a.finished_at AT TIME ZONE 'Europe/Athens') BETWEEN 2 AND 4) AS "nightOwl",
                (SELECT COUNT(*) FROM questions q WHERE q.created_by = u.id AND q.is_active = true) AS "questions",
                (SELECT COUNT(DISTINCT a.course_id) FROM a WHERE a.user_id = u.id) AS "courses",
                u.id IN (SELECT id FROM users ORDER BY created, id LIMIT 30) AS "og"
            FROM users u
            WHERE u.id IN (:ids)
            """, nativeQuery = true)
    List<StatsRow> findStats(@Param("ids") Collection<UUID> ids);

    interface SummaryRow {
        Long getAdmins();
        Long getHelpers();
        Long getStudents();
        Long getQuizzes();
        Long getQuestions();
    }

    @Query(value = """
            SELECT COUNT(*) FILTER (WHERE u.role = 'ADMIN') AS "admins",
                COUNT(*) FILTER (WHERE u.role = 'HELPER') AS "helpers",
                COUNT(*) FILTER (WHERE u.role = 'STUDENT') AS "students",
                -- site-wide total: old bundles still count as quizzes taken
                (SELECT COUNT(*) FROM bundles)
                    + (SELECT COUNT(*) FROM quiz_attempts WHERE finished_at IS NOT NULL) AS "quizzes",
                (SELECT COUNT(*) FROM questions WHERE is_active = true) AS "questions"
            FROM users u
            WHERE u.active = true
            """, nativeQuery = true)
    SummaryRow getSummary();
}
