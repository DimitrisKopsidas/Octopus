package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

/** An answer the user picked for a served question. */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "attempt_answers")
public class AttemptAnswer {

    @EmbeddedId
    private Id id = new Id();

    @MapsId("attemptQuestionId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_question_id", nullable = false, updatable = false)
    private AttemptQuestion attemptQuestion;

    @MapsId("answerId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answer_id", nullable = false, updatable = false)
    private Answer answer;

    public AttemptAnswer(AttemptQuestion attemptQuestion, Answer answer) {
        this.attemptQuestion = attemptQuestion;
        this.answer = answer;
    }

    @Getter
    @NoArgsConstructor
    @EqualsAndHashCode
    @Embeddable
    public static class Id implements Serializable {

        @Column(name = "attempt_question_id")
        private UUID attemptQuestionId;

        @Column(name = "answer_id")
        private Long answerId;
    }
}
