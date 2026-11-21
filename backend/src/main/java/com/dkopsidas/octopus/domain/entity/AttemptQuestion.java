package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/** A question served in an attempt, answered or not. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "attempt_questions",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_attempt_questions_attempt_question", columnNames = {"attempt_id", "question_id"}),
                @UniqueConstraint(name = "uk_attempt_questions_attempt_position", columnNames = {"attempt_id", "position"})
        }
)
public class AttemptQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false, updatable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false, updatable = false)
    private Question question;

    @Column(name = "position", nullable = false, updatable = false)
    private int position;

    // null until submitted
    @Column(name = "is_correct")
    private Boolean correct;

    // answers the user picked
    @OneToMany(mappedBy = "attemptQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    // n + 1 query problem
    @BatchSize(size = 100)
    private Set<AttemptAnswer> selectedAnswers = new HashSet<>();

    public AttemptQuestion(Question question, int position) {
        this.question = question;
        this.position = position;
    }

    public void addSelectedAnswer(Answer answer) {
        selectedAnswers.add(new AttemptAnswer(this, answer));
    }
}
