package com.dkopsidas.octopus.service.Prototype;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Engine {

    public static void main(String[] args){

        List<ExerciseVariable> variables = new ArrayList<>();


        //Dedomena
        variables.add(new ExerciseVariable("VBB", 4.0, 0));
        variables.add(new ExerciseVariable("RB", 91000.0, 0));
        variables.add(new ExerciseVariable("RC", 4500.0, 0));
        variables.add(new ExerciseVariable("VCC", 9.0, 0));
        variables.add(new ExerciseVariable("VBE", 0.7, 0));
        variables.add(new ExerciseVariable("β", 209.0, 0));
        variables.add(new ExerciseVariable("VE", 0.0, 0));
        variables.add(new ExerciseVariable("VCEsat", 0.3, 0));

        //goals
        variables.add(new ExerciseVariable("VB", null, 1));
        variables.add(new ExerciseVariable("IB", null, 2));
        variables.add(new ExerciseVariable("IC", null, 3));
        variables.add(new ExerciseVariable("VC", null, 4));
        variables.add(new ExerciseVariable("VCE", null,5));
        variables.add(new ExerciseVariable("IE", null, 6));


        List<Step> steps = new ArrayList<>();

        steps.add(new Step(1L,0,"find VB", null, "VB = VBE + VE", null, null, false, null));
        steps.add(new Step(2L,1,"find IB", null, "IB = (VBB - VB)/ RB", null, null, false, null));

        steps.add(new Step(3L, 2, "Check Cutoff", null, null, "IB < 0", "Αποκοπή", true, null));

        steps.add(new Step(4L,3,"find IC", null, "IC = β * IB", null, null, false, null));
        steps.add(new Step(5L,4,"find VC",null ,"VC = VCC - (IC * RC)" ,null, null, false, null));

        steps.add(new Step(6L,5,"Check Active",null ,null , "VC > VB > VE", "Ενεργός", false, 9));

        steps.add(new Step(7L, 6, "Saturation Info", null, null, null, "Κορεσμός", false, null));

        steps.add(new Step(8L,6,"find VCE", null, "VCE = VCEsat", null, null, false, null));
        steps.add(new Step(9L,7,"find VC", null, "VC = VCE + VE", null, null, false, null));
        steps.add(new Step(10L,8,"find IC", null, "IC = (VCC - VC)/RC", null, null, false, null));
        steps.add(new Step(11L,7,"find IE", null, "IE = IC + IB", null, null, false, null));


       // List<String> steps = List.of("VB = VBE + VE", "IB = (VBB - VB)/ RB", "IC = β * IB","VC = VCC - (IC * RC)", "VCE = VCEsat", "VC = VCE + VE", "IC = (VCC - VC)/RC", "IE = IC + IB"); //,"IC = beta * IB", "VCE = VCEsat", "VC = VCE + VE", "IC = (VCC - VC)/RC", "IE = IC + IB");


        //Convert to hashmap for easy access
        Map<String, Double> toHash = new HashMap<>();
        for (ExerciseVariable n: variables) {
            if (n.getValue() != null) {
                toHash.put(n.getName(), n.getValue());
            }
        }


        Exercise test = new Exercise(
                "Askisi test",
                "Vreite to IB, IC, VC, VCE, IE",
                "imageUrl",
                variables,
                steps
        );

        System.out.println(test.getTitle());
        System.out.println(test.getPromnt());


        for (int i = 0; i < steps.size(); i++){
            Step currentstep = test.getSteps().get(i);

            if (currentstep.getCalculation() != null){

                String target = currentstep.getCalculation().split("=")[0].trim();

                Double answer = solveStep(toHash, currentstep.getCalculation());
                toHash.put(target, answer);

                System.out.println("Step "+ i + ": " + target + "=" + answer);

                ExerciseVariable targetVariable = findVariable(variables, target); //Reference
                if (targetVariable != null){
                    targetVariable.setValue(answer);
                }

            } else if (currentstep.getCondition() != null) {

                if (isTrue(toHash, currentstep.getCondition())){

                    System.out.println("Step "+ i + ": " + currentstep.getCondition() + " is true");
                    if (currentstep.getConclusion() != null){
                        System.out.println("Conclusion: " + currentstep.getConclusion());
                    }
                    if (currentstep.isTerminate()){
                        System.out.println("Terminating");
                        break;
                    } else if (currentstep.getJumpTo() != null) {
                        System.out.println("Jumping to step " + currentstep.getJumpTo());
                        i = currentstep.getJumpTo() - 1;
                    }

                } else {
                    System.out.println("Step "+ i + ": " + currentstep.getCondition() + " is false moving to next step");
                }

            } else if (currentstep.getConclusion() != null) {

                System.out.println("Conclusion (Info Step): " + currentstep.getConclusion());
            }
        }
    }

    private static Double solveStep(Map<String, Double> calc, String step){
        String[] parts = step.split("="); //split to target and equation
        String equation = parts[1].trim(); // get equation

        ExpressionBuilder builder = new ExpressionBuilder(equation);

        for (String key : calc.keySet()) { //from map get all keys
            builder.variable(key); //put them as variables
        }

        Expression expression = builder.build();
        for (String key : calc.keySet()){ //from the map get all keys
            expression.setVariable(key, calc.get(key)); //in every variable set value
        }

        return expression.evaluate();
    }

    private static boolean isTrue(Map<String, Double> toHash, String branch){

        String operator = "";
        if (branch.contains("<=")){
            operator = "<=";
        }
        else if (branch.contains(">=")){
            operator = ">=";
        }
        else if (branch.contains("<")){
            operator = "<";
        }
        else if (branch.contains(">")){
            operator = ">";
        }
        else if (branch.contains("==")){
            operator = "==";
        }

        if (operator.isEmpty()){
            return false;
        }

        String[] parts = branch.split(operator);

        for (int i = 0; i < parts.length - 1; i++) {
            String variable = parts[i].trim();
            String valueString = parts[i+1].trim();
            Double value;

            if (toHash.containsKey(valueString)){ // check if valueString is in toHash
                value = toHash.get(valueString);
            }
            else{
                value = Double.parseDouble(valueString);
            }

            double realVariable = toHash.getOrDefault(variable, 0.0);

            boolean condition = switch (operator) {
                case "==" -> realVariable == value;
                case "<=" -> realVariable <= value;
                case ">=" -> realVariable >= value;
                case "<" -> realVariable < value;
                case ">" -> realVariable > value;
                default -> false;
            };

            if (!condition){
                return false;
            }
        }

        return true;
    }

    private static ExerciseVariable findVariable(List<ExerciseVariable> variables, String title){
        for (ExerciseVariable n : variables) {
            if (n.getName().equals(title)) {
                return n;
            }
        }
        return null;
    }
}
