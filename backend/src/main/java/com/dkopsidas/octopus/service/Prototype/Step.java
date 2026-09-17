package com.dkopsidas.octopus.service.Prototype;

public class Step {

    private Long id;
    private Integer order;
    private String description;
    private String tip;
    private String calculation;
    private String condition;
    private String conclusion;
    private Boolean terminate;
    private Integer jumpTo;


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
