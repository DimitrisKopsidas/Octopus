package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.dto.LeaderboardRowDto;
import com.dkopsidas.octopus.domain.entity.Bundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


public interface BundleRepository extends JpaRepository<Bundle, Long> {

    @Query("SELECT COUNT(DISTINCT b) FROM Bundle b JOIN b.answers a WHERE a.question.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);

    //Methods for leaderboard implementation
    @Query(value = """
    WITH bundle_scores AS (
        SELECT b.id, b.created_by, b.score
        FROM bundles b
            JOIN bundle_answers ba ON ba.bundle_id = b.id
            JOIN answers a ON a.id = ba.answer_id
            JOIN questions q ON a.question_id = q.id
        WHERE q.course_id = :courseId
        GROUP BY b.id, b.created_by
    )
    SELECT u.display_name AS name,
        SUM(bs.score)::double precision AS value
    FROM bundle_scores bs
        JOIN users u ON u.id = bs.created_by
    GROUP BY u.id, u.display_name
    ORDER BY value DESC;
    """, nativeQuery = true)
    List<LeaderboardRowDto> findLeaderboardByCourse(@Param("courseId") Long courseId);

    @Query(value = """
    SELECT c.name AS name, COUNT(DISTINCT b.id) AS value
    FROM bundles b
        JOIN bundle_answers ba ON ba.bundle_id = b.id
        JOIN answers a ON a.id = ba.answer_id
        JOIN questions q ON q.id = a.question_id
        JOIN courses c ON q.course_id = c.id
    GROUP BY c.name
    ORDER BY value DESC
    """, nativeQuery = true)
    List<LeaderboardRowDto> findMostPopularCourses();

    @Query(value = """
    SELECT c.name AS name, AVG(b.score)::double precision AS value
    FROM bundles b
        JOIN bundle_answers ba ON ba.bundle_id = b.id
        JOIN answers a ON a.id = ba.answer_id
        JOIN questions q ON q.id = a.question_id
        JOIN courses c ON c.id = q.course_id
    GROUP BY c.name
    ORDER BY value DESC
    """, nativeQuery = true)
    List<LeaderboardRowDto> findCoursesByAverageScore();

    @Query(value = """
    SELECT u.display_name AS name, AVG(b.score)::double precision AS value
    FROM bundles b
        JOIN users u ON b.created_by = u.id
    GROUP BY u.display_name
    ORDER BY value DESC
    """, nativeQuery = true)
    List<LeaderboardRowDto> findUsersByAverageScore();

    @Query(value = """
    SELECT u.username AS name, COUNT(DISTINCT q.id) AS value
    FROM questions q
        JOIN users u ON u.id = q.created_by
    GROUP BY u.username
    ORDER BY value DESC
    """, nativeQuery = true)
    List<LeaderboardRowDto> findQuestionsCreatedByUser();


}
