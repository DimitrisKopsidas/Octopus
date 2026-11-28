package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/** One question of a quiz at a fixed position. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @EmbeddedId
    private Id id = new Id();

    @MapsId("quizId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false, updatable = false)
    private Quiz quiz;

    // updatable: Quiz.replaceQuestions rewrites the question of a position in place
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    public QuizQuestion(Quiz quiz, int position, Question question) {
        this.quiz = quiz;
        this.id.position = position;
        this.question = question;
    }

    public int getPosition() {
        return id.position;
    }

    @Getter
    @NoArgsConstructor
    @EqualsAndHashCode
    @Embeddable
    public static class Id implements Serializable {

        @Column(name = "quiz_id")
        private UUID quizId;

        @Column(name = "position")
        private int position;
    }
}
