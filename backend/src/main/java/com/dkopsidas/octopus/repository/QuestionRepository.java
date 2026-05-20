package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByCourseId(Long courseId);

    Long countByCourseId(Long courseId);
}
