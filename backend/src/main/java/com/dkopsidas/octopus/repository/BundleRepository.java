package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Bundle;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BundleRepository extends JpaRepository<Bundle, Long> {

    @Query("SELECT COUNT(DISTINCT b) FROM Bundle b JOIN b.answers a WHERE a.question.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);

    // Loads the answers in the same query instead of one extra query per bundle.
    @EntityGraph(attributePaths = "answers")
    @Query("SELECT DISTINCT b FROM Bundle b JOIN b.answers a WHERE b.createdBy.id = :userId AND a.question.course.id = :courseId")
    List<Bundle> findAllByUserIdAndCourseId(@Param("userId") java.util.UUID userId, @Param("courseId") Long courseId);
}
