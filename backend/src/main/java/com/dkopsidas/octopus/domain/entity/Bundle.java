package com.dkopsidas.octopus.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@Table(name = "bundles")
public class Bundle {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "setNum")
    private Integer setNum;

    @Column(name = "score", nullable = false)
    private int score;

    @JsonIgnore//TODO test that the answers are returned when needed
    @ManyToMany
    @JoinTable(
            name = "bundle_answers",
            joinColumns = @JoinColumn(name = "bundle_id"),
            inverseJoinColumns = @JoinColumn(name = "answer_id")
    )
    private List<Answer> answers = new ArrayList<>();

    @Column(name = "created", updatable = false, nullable = false)
    private Instant created;

    public void addAnswer(Answer a) {
        answers.add(a);
    }
}
