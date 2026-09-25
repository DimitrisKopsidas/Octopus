package com.dkopsidas.octopus.service.Prototype;

public class Step {

    private Long id;
    private Integer order; //the sequential order of the step in the exercise
    private String description; //helpful text describing the point of the step
    private String tip; //optional hidden text to help the user
    private String calculation; //the mathematical equation
    private String condition; // optional condition to be checked to branch off to another step
    private String conclusion; // the text to display if the condition is true
    private Boolean terminate; // if the condition met should end the exercise
    private Integer jumpTo; // the step with the selected order to jump to if the condition is met


    public Step(Long id, Integer order, String description, String tip, String calculation, String condition, String conclusion, Boolean terminate, Integer jumpTo) {
        this.id = id;
        this.order = order;
        this.description = description;
        this.tip = tip;
        this.calculation = calculation;
        this.condition = condition;
        this.conclusion = conclusion;
        this.terminate = terminate;
        this.jumpTo = jumpTo;
    }


    public String getConclusion() {
        return conclusion;
    }

    public String getCalculation() {
        return calculation;
    }

    public boolean isTerminate() {
        return terminate;
    }

    public Integer getJumpTo() {
        return jumpTo;
    }

    public String getCondition() {
        return condition;
    }
}
