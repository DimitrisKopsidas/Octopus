package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "mul_question")
public class MulQuestion {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)//column name
    private Course course;

    @Column(name = "title", nullable = false)
    private String title;

    @OneToMany(
            mappedBy = "mulQuestion",//field not column
            cascade = CascadeType.ALL,//Saving a Question also saves its Answers
            orphanRemoval = true//Removing an answer from the list deletes it from DB
    )
    private List<MulAnswer> mulAnswers = new ArrayList<>();

    public void addAnswer(MulAnswer a) {
        mulAnswers.add(a);
        a.setMulQuestion(this);
    }

    public void removeAnswer(MulAnswer a) {
        mulAnswers.remove(a);
        a.setMulQuestion(null);
    }
}
