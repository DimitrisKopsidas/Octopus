package com.dkopsidas.octopus.service.Prototype;

public class ExerciseVariable {

    private Long id;
    private String name; // the mathematical name of the variable
    private Double value; // the mathematical value of the variable
    private Integer goal; // if 0 then the variable is a starter, if above zero then it is the respective goal of the exercise

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
