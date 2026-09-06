package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Bundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BundleRepository extends JpaRepository<Bundle, Long> {

    @Query("SELECT COUNT(DISTINCT b) FROM Bundle b JOIN b.answers a WHERE a.question.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);

    //Methods for leaderboard implementation
    List<Bundle> findDistinctByAnswers_Question_Course_Id(Long courseId);
}
