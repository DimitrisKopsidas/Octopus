package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString(exclude = "mulQuestions")
@Entity
@Table(name = "course")
public class Course {//TODO add type

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "semester", nullable = false)
    private int semester;

    @OneToMany(mappedBy = "course")//field not column
    private List<MulQuestion> mulQuestions = new ArrayList<>();
}
