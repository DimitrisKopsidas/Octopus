package com.dkopsidas.octopus.service.Prototype;

import java.util.List;
import java.util.Map;

public class Exercise {

    private String title;
    private String promnt;
    private String imageUrl;

    private Map<String, Double> variables;

    private List<String> goals;

    private List<String> steps;

    public Exercise(String title, String promnt, String imageUrl, Map<String, Double> variables, List<String> goals, List<String> steps) {
        this.title = title;
        this.promnt = promnt;
        this.imageUrl = imageUrl;
        this.variables = variables;
        this.goals = goals;
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

    public Map<String, Double> getVariables() {
        return variables;
    }

    public List<String> getGoals() {
        return goals;
    }

    public List<String> getSteps() {
        return steps;
    }
}
