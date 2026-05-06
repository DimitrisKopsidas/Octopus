package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@Table(name = "mul_answer")
public class MulAnswer {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mul_question_id", nullable = false)//column name
    private MulQuestion mulQuestion;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;
}
