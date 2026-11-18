package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** One started quiz */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // null = guest
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false, updatable = false)
    private Course course;

    // null = custom-size quiz, or the quiz was deleted/edited since (DB sets it null)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, length = 16, updatable = false)
    private ExamType examType;

    // copy of quiz.setNum, kept when the quiz is gone; null = custom
    @Column(name = "set_num", updatable = false)
    private Integer setNum;

    @Column(name = "question_count", nullable = false, updatable = false)
    private int questionCount;

    // null until submitted, set together with finishedAt
    @Column(name = "correct_count")
    private Integer correctCount;

    @Column(name = "started_at", nullable = false, updatable = false)
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    // submit deadline, null = no timer
    @Column(name = "expires_at", updatable = false)
    private Instant expiresAt;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<AttemptQuestion> questions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (startedAt == null) {
            startedAt = Instant.now();
        }
    }

    public void addQuestion(AttemptQuestion q) {
        questions.add(q);
        q.setAttempt(this);
    }

    public boolean isFinished() {
        return finishedAt != null;
    }
}
