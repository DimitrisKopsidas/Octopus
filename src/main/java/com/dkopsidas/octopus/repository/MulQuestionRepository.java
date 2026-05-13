package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.MulQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MulQuestionRepository extends JpaRepository<MulQuestion, Long> {
    List<MulQuestion> findByCourse(Course course);
}
