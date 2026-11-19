package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.QuizAttempt;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {

    @EntityGraph(attributePaths = {"questions", "questions.question"})
    Optional<QuizAttempt> findWithQuestionsById(UUID id);
}
