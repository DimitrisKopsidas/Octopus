package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Bundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.dkopsidas.octopus.domain.dto.LeaderboardRow;
import java.util.List;

public interface BundleRepository extends JpaRepository<Bundle, Long> {

    @Query("SELECT COUNT(DISTINCT b) FROM Bundle b JOIN b.answers a WHERE a.question.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);

    @Query(value = """
        SELECT display_name, ROUND(score,2), timestamp
           FROM (
               SELECT DISTINCT ON (u.display_name)
                   u.display_name,
                   (SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::numeric / COUNT(a.id) * 100) AS score,
                   b.created AS timestamp
               FROM bundles b
                   JOIN users u ON u.id = b.user_id
                   JOIN bundle_answers ba ON ba.bundle_id = b.id
                   JOIN answers a ON a.id = ba.answer_id
                   JOIN questions q ON a.question_id = q.id
                   JOIN courses c ON c.id = q.course_id
               WHERE c.id = courseId
               GROUP BY u.display_name, b.id, b.created
               ORDER BY u.display_name, score DESC
           ) AS best_per_user
           ORDER BY score DESC
        """, nativeQuery = true)
    List<LeaderboardRow> findLeaderboardByCourse(@Param("courseId") Long courseId);
}
