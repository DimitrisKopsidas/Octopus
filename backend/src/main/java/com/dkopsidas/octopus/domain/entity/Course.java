package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString(exclude = "questions")
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "semester", nullable = false)
    private int semester;

    @OneToMany(mappedBy = "course")//field not column
    private List<Question> questions = new ArrayList<>();

    /**
     * Active questions in this course, computed by the database when the course
     * is loaded. Read-only: a subquery, not a column.
     * <p>
     * Counting through the {@link #questions} collection instead would load
     * every question just to call size() on it.
     */
    @org.hibernate.annotations.Formula(
            "(select count(*) from questions q where q.course_id = id and q.is_active = true)"
    )
    private long questionCount;

    /**
     * When material was last added or edited in this course.
     * <p>
     * Deliberately not {@link #updatedAt}: that one only moves when the course
     * row itself is saved — a change to questionSetSize or the timer — and is
     * null for every course seeded straight into the database. What the course
     * card claims next to the question count is "when did content last arrive",
     * and that lives on the questions.
     */
    @org.hibernate.annotations.Formula(
            "(select max(q.updated) from questions q where q.course_id = id and q.is_active = true)"
    )
    private java.time.Instant lastContentUpdate;

    @Column(name = "question_set_size", nullable = false)
    private int questionSetSize;

    @Column(name = "default_timer_minutes", nullable = false)
    private int defaultTimerMinutes;

    @Column(name = "updated_at")
    @org.hibernate.annotations.UpdateTimestamp
    private java.time.Instant updatedAt;

    public void addQuestion(Question a) {
        questions.add(a);
        a.setCourse(this);
    }

    public void removeQuestion(Question a) {
        questions.remove(a);
        a.setCourse(null);
    }
}
