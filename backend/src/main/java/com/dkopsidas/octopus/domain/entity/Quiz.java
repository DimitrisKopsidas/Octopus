package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** A fixed question set of a course, e.g. "Exam set 3". Editing a set = delete it and create a new quiz. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "quizzes",
        uniqueConstraints = @UniqueConstraint(name = "uk_quizzes_course_type_set", columnNames = {"course_id", "exam_type", "set_num"})
)
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, length = 16)
    private ExamType examType;

    @Column(name = "set_num", nullable = false)
    private int setNum;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id.position ASC")
    private List<QuizQuestion> questions = new ArrayList<>();

    @Column(name = "created", updatable = false, nullable = false)
    private Instant created;

    @Column(name = "updated", nullable = false)
    private Instant updated;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        created = now;
        updated = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updated = Instant.now();
    }

    /**
     * Updates existing question rows instead of deleting and re-adding them, 
     * because Hibernate may insert before deleting. 
     * This avoids duplicate (quiz_id, position) primary-key errors.
     */
    public void replaceQuestions(List<Question> newQuestions) {
        for (int i = 0; i < newQuestions.size(); i++) {
            if (i < questions.size()) {
                questions.get(i).setQuestion(newQuestions.get(i));
            } else {
                questions.add(new QuizQuestion(this, i, newQuestions.get(i)));
            }
        }
        questions.subList(newQuestions.size(), questions.size()).clear(); // deletes the tail
        updated = Instant.now();
    }
}
