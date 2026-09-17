package com.dkopsidas.octopus.service.Prototype;

import java.util.List;

public class Exercise {

    private String title;
    private String promnt;
    private String imageUrl;

    private List<ExerciseVariable> variables;

    private List<Step> steps;

    public Exercise(String title, String promnt, String imageUrl, List<ExerciseVariable> variables, List<Step> steps) {
        this.title = title;
        this.promnt = promnt;
        this.imageUrl = imageUrl;
        this.variables = variables;
        this.steps = steps;
    }

    public String getPromnt() {
        return promnt;
    }

    public String getTitle() {
        return title;
    }

    public List<Step> getSteps() {
        return steps;
    }
}
