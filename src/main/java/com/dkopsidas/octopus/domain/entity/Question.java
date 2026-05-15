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

    @Column(name = "title", nullable = false)
    private String title;

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

    @Column(name = "created", updatable = false, nullable = false)
    private Instant created;

    @Column(name = "updated", nullable = false)
    private Instant updated;

    public void addAnswer(Answer a) {
        answers.add(a);
        a.setQuestion(this);
    }

    public void removeAnswer(Answer a) {
        answers.remove(a);
        a.setQuestion(null);
    }

    public void replaceAnswers(List<Answer> newAnswers) {
        this.answers.clear(); // orphanRemoval deletes removed answers from DB
        newAnswers.forEach(this::addAnswer); // sets back-reference on each
    }

    public Question() {
    }

    public Question(Long id, String title, List<Answer> answers, Course course, Instant created, Instant updated) {
        this.id = id;
        this.title = title;
        this.answers = answers;
        this.course = course;
        this.created = created;
        this.updated = updated;
    }
}
