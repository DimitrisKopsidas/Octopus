package com.dkopsidas.octopus.service.Prototype;

import java.util.List;

public class ExerciseVariable {

    private String title;
    private Double value;
    private Integer goal;
    private String branch;
    private List<String> conditions;

    public ExerciseVariable(String title, Double value, Integer goal, String branch, List<String> conditions) {
        this.title = title;
        this.value = value;
        this.goal = goal;
        this.branch = branch;
        this.conditions = conditions;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Integer getGoal() {
        return goal;
    }

    public void setGoal(Integer goal) {
        this.goal = goal;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public List<String> getConditions() {
        return conditions;
    }

    public void setConditions(List<String> conditions) {
        this.conditions = conditions;
    }
}
