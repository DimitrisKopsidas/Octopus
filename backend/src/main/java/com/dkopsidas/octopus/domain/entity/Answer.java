package com.dkopsidas.octopus.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

// attempt options load their answers lazily, one query per 100 instead of one each
@BatchSize(size = 100)
@Getter
@Setter
@Entity
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    // false = replaced by an edit
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)//column name
    private Question question;

    public boolean getIsCorrect() {
        return this.isCorrect;
    }
}
