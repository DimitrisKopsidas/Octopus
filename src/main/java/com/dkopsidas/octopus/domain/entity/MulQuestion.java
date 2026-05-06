package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;

@Getter
@Setter
@ToString
@Entity
@Table(name = "mulquestion")
public class MulQuestion {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "course", nullable = false)
    private Course course;

    @Column(name = "title", nullable = false)
    private String title;

    public MulQuestion() {
    }

    public MulQuestion(Long id, Course course, String title) {
        this.id = id;
        this.course = course;
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MulQuestion mulQuestion = (MulQuestion) o;
        return Objects.equals(id, mulQuestion.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
