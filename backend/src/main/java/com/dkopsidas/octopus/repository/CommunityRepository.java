package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
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
                CASE WHEN :sort = 'quizzes' THEN (SELECT COUNT(*) FROM bundles b WHERE b.created_by = u.id) END DESC,
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
     * Everything a profile shows, for a batch of users in one query. A quiz's
     * percentage is correct answers over answers given; "perfect" counts those where they are
     * equal, with at least 5 answers so a quiz with one answered question doesn't count.
     * Only active questions count towards "questions" (soft-deleted ones don't).
     */
    @Query(value = """
            WITH b AS (
                SELECT b.id, b.created_by, b.score, b.created, COUNT(ba.answer_id) AS answered
                FROM bundles b LEFT JOIN bundle_answers ba ON ba.bundle_id = b.id
                WHERE b.created_by IN (:ids)
                GROUP BY b.id
            )
            SELECT u.id AS "userId",
                (SELECT COUNT(*) FROM b WHERE b.created_by = u.id) AS "quizzes",
                (SELECT AVG(b.score * 100.0 / NULLIF(b.answered, 0)) FROM b WHERE b.created_by = u.id)::double precision AS "avgScore",
                (SELECT COUNT(*) FROM b WHERE b.created_by = u.id AND b.answered >= 1 AND b.score >= b.answered) AS "perfect",
                (SELECT COUNT(*) FROM b WHERE b.created_by = u.id
                    AND EXTRACT(HOUR FROM b.created AT TIME ZONE 'Europe/Athens') BETWEEN 2 AND 4) AS "nightOwl",
                (SELECT COUNT(*) FROM questions q WHERE q.created_by = u.id AND q.is_active = true) AS "questions",
                (SELECT COUNT(DISTINCT q.course_id) FROM b
                    JOIN bundle_answers ba ON ba.bundle_id = b.id
                    JOIN answers a ON a.id = ba.answer_id
                    JOIN questions q ON q.id = a.question_id
                 WHERE b.created_by = u.id) AS "courses",
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
                (SELECT COUNT(*) FROM bundles) AS "quizzes",
                (SELECT COUNT(*) FROM questions WHERE is_active = true) AS "questions"
            FROM users u
            WHERE u.active = true
            """, nativeQuery = true)
    SummaryRow getSummary();

    interface ActivityRow {
        String getId();
        String getType();
        String getUsername();
        String getDisplayName();
        String getRole();
        String getBadgeCode();
        Integer getTier();
        String getTitle();
        Instant getTimestamp();
    }

    @Query(value = """
            SELECT * FROM (
                (
                    SELECT 
                        'bundle-' || b.id::text AS "id",
                        CASE 
                            WHEN b.score >= COUNT(ba.answer_id) AND COUNT(ba.answer_id) >= 1 THEN 'PERFECT_QUIZ'
                            ELSE 'QUIZ_COMPLETED'
                        END AS "type",
                        u.username AS "username",
                        u.display_name AS "displayName",
                        u.role::text AS "role",
                        CASE 
                            WHEN b.score >= COUNT(ba.answer_id) AND COUNT(ba.answer_id) >= 1 THEN 'PERFECT'
                            ELSE 'QUIZZES'
                        END AS "badgeCode",
                        (SELECT COUNT(*) FROM bundles b2 WHERE b2.created_by = u.id AND b2.created <= b.created)::int AS "tier",
                        CASE 
                            WHEN b.score >= COUNT(ba.answer_id) AND COUNT(ba.answer_id) >= 1 THEN '100% Επιτυχία!'
                            ELSE 'Ολοκληρωμένο Quiz'
                        END AS "title",
                        b.created AS "timestamp"
                    FROM bundles b
                    JOIN users u ON u.id = b.created_by
                    LEFT JOIN bundle_answers ba ON ba.bundle_id = b.id
                    WHERE u.active = true
                    GROUP BY b.id, b.score, b.created, u.id, u.username, u.display_name, u.role
                    ORDER BY b.created DESC
                    LIMIT :limit
                )
                UNION ALL
                (
                    SELECT 
                        'q-' || q.id::text AS "id",
                        'QUESTION_CREATED' AS "type",
                        u.username AS "username",
                        u.display_name AS "displayName",
                        u.role::text AS "role",
                        'CREATOR' AS "badgeCode",
                        (SELECT COUNT(*) FROM questions q2 WHERE q2.created_by = u.id AND q2.created <= q.created AND q2.is_active = true)::int AS "tier",
                        q.title AS "title",
                        q.created AS "timestamp"
                    FROM questions q
                    JOIN users u ON u.id = q.created_by
                    WHERE q.is_active = true AND u.active = true
                    ORDER BY q.created DESC
                    LIMIT :limit
                )
                UNION ALL
                (
                    SELECT 
                        'join-' || u.id::text AS "id",
                        'MEMBER_JOINED' AS "type",
                        u.username AS "username",
                        u.display_name AS "displayName",
                        u.role::text AS "role",
                        CASE WHEN u.id IN (SELECT id FROM users ORDER BY created, id LIMIT 30) THEN 'OG' ELSE NULL END AS "badgeCode",
                        1 AS "tier",
                        'Νέο μέλος' AS "title",
                        u.created AS "timestamp"
                    FROM users u
                    WHERE u.active = true
                    ORDER BY u.created DESC
                    LIMIT :limit
                )
            ) activity
            ORDER BY "timestamp" DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<ActivityRow> findRecentActivity(@Param("limit") int limit);
}
