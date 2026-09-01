package com.dkopsidas.octopus.domain.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "title", nullable = false, length = 510)
    private String title;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_active")
    private boolean isActive;

    @JsonManagedReference
    @OneToMany(
            mappedBy = "question",//field not column
            cascade = CascadeType.ALL,//Saving a Question also saves its Answers
            orphanRemoval = true//Removing an answer from the list deletes it from DB
    )
    private List<Answer> answers = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)//column name
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", updatable = false, nullable = false)
    private User createdBy;

    @Column(name = "created", updatable = false, nullable = false)
    private Instant created;

    @Column(name = "updated", nullable = false)
    private Instant updated;

    /**
     * Same lifecycle callbacks as {@link User}, so the two entities stop doing
     * the same job in two different ways.
     * <p>
     * Before these existed, {@code updated} was written once by QuestionMapper
     * and never again: updateQuestion copies title, image and answers onto the
     * managed entity but never touched the timestamp. The column read as "last
     * modified" and in fact meant "created", which is why Course.lastContentUpdate
     * now reads created explicitly instead of relying on the accident.
     * <p>
     * Note this fires on every flush of the row -- deactivation and image
     * upload/delete included. That is the correct meaning of "last touched";
     * just do not read it as "new material arrived".
     */
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

    public void addAnswer(Answer a) {
        answers.add(a);
        a.setQuestion(this);
    }

    public void replaceAnswers(List<Answer> newAnswers) {
        this.answers.clear(); // orphanRemoval deletes removed answers from DB
        newAnswers.forEach(this::addAnswer); // sets back-reference on each
    }

    public Question() {
    }

    public Question(Long id, String title, String imageUrl, boolean isActive, List<Answer> answers, Course course, Instant created, Instant updated) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.isActive = isActive;
        this.answers = answers;
        this.course = course;
        this.created = created;
        this.updated = updated;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public boolean getIsActive() {
        return this.isActive;
    }
}
