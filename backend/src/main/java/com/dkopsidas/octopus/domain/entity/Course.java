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

    @Column(name = "setQuestionCount", nullable = false)
    private int setQuestionCount;

    public void addQuestion(Question a) {
        questions.add(a);
        a.setCourse(this);
    }

    public void removeQuestion(Question a) {
        questions.remove(a);
        a.setCourse(null);
    }
}
