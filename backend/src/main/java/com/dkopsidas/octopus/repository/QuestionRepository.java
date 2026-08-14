package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Question;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Answers come back with the questions. Every caller maps straight to a DTO
     * that contains them, so leaving them lazy cost one extra query per question
     * — 85 questions meant 86 round trips instead of one.
     */
    @EntityGraph(attributePaths = "answers")
    List<Question> findAllByCourseIdAndIsActiveTrue(Long courseId);

    Long countByCourseIdAndIsActiveTrue(Long courseId);
}
