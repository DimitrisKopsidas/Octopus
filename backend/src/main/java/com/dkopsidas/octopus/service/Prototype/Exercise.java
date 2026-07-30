package com.dkopsidas.octopus.service.Prototype;

import java.util.List;

public class Exercise {

    private String title;
    private String promnt;
    private String imageUrl;

    private List<ExerciseVariable> variables;

    private List<String> steps;

    public Exercise(String title, String promnt, String imageUrl, List<ExerciseVariable> variables, List<String> steps) {
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

    public String getImageUrl() {
        return imageUrl;
    }

    public List<ExerciseVariable> getVariables() {
        return variables;
    }


    public List<String> getSteps() {
        return steps;
    }
}
