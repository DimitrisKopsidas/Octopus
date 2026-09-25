package com.dkopsidas.octopus.service.Prototype;

import java.util.List;

public class Exercise {

    private String title;
    private String prompt;
    private String imageUrl;

    private List<ExerciseVariable> variables;

    private List<Step> steps;

    public Exercise(String title, String prompt, String imageUrl, List<ExerciseVariable> variables, List<Step> steps) {
        this.title = title;
        this.prompt = prompt;
        this.imageUrl = imageUrl;
        this.variables = variables;
        this.steps = steps;
    }

    public String getPrompt() {
        return prompt;
    }

    public String getTitle() {
        return title;
    }

    public List<Step> getSteps() {
        return steps;
    }
}
