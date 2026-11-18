package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;


public interface AnswerRepository extends JpaRepository<Answer, Long> {

    /** v2: active answers of the served questions */
    List<Answer> findByQuestionIdInAndActiveTrueOrderByIdAsc(Collection<Long> questionIds);
}
