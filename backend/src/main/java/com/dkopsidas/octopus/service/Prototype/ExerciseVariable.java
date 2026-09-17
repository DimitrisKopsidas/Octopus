package com.dkopsidas.octopus.service.Prototype;

public class ExerciseVariable {

    private Long id;
    private String name;
    private Double value;
    private Integer goal;


    public ExerciseVariable(String name, Double value, Integer goal) {
        this.name = name;
        this.value = value;
        this.goal = goal;
    }

    public String getName() {
        return name;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

}
