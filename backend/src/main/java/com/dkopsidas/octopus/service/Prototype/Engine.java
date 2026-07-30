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
        variables.add(new ExerciseVariable("VBB", 4.0, 0, null, null));
        variables.add(new ExerciseVariable("RB", 91000.0, 0, null, null));
        variables.add(new ExerciseVariable("RC", 4500.0, 0, null, null));
        variables.add(new ExerciseVariable("VCC", 9.0, 0, null, null));
        variables.add(new ExerciseVariable("VBE", 0.7, 0, null, null));
        variables.add(new ExerciseVariable("β", 209.0, 0, null, null));
        variables.add(new ExerciseVariable("VE", 0.0, 0, null, null));
        variables.add(new ExerciseVariable("VCEsat", 0.3, 0, null, null));

        //goals
        variables.add(new ExerciseVariable("VB", null, 1, null, null));
        variables.add(new ExerciseVariable("IB", null, 2, "IB <= 0", List.of("Αποκοπή", "Ενεργός ή Κορεσμού")));
        variables.add(new ExerciseVariable("IC", null, 3, null, null));
        variables.add(new ExerciseVariable("VC", null, 4, "VC > VB > VE", List.of("Ενεργός", "Κορεσμού")));
        variables.add(new ExerciseVariable("VCE", null, 5, null, null));
        variables.add(new ExerciseVariable("IE", null, 6, null, null));


        List<String> steps = List.of("VB = VBE + VE", "IB = (VBB - VB)/ RB", "IC = β * IB","VC = VCC - (IC * RC)", "VCE = VCEsat", "VC = VCE + VE", "IC = (VCC - VC)/RC", "IE = IC + IB"); //,"IC = beta * IB", "VCE = VCEsat", "VC = VCE + VE", "IC = (VCC - VC)/RC", "IE = IC + IB");


        //Convert to hashmap for easy access
        Map<String, Double> toHash = new HashMap<>();
        for (ExerciseVariable n: variables) {
            if (n.getValue() != null) {
                toHash.put(n.getTitle(), n.getValue());
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


        List<String> checkedBranches = new ArrayList<>(); //List to check if a branch has already been checked


        for (int i = 0; i < steps.size(); i++){
            String step = test.getSteps().get(i);

            String target = step.split("=")[0].trim();

            Double answer = solveStep(toHash, step);
            toHash.put(target, answer);

            System.out.println("Step "+ i + ": " + target + "=" + answer);

            ExerciseVariable targetVariable = findVariable(variables, target); //Reference
            if (targetVariable != null){
                targetVariable.setValue(answer);
            }

            if (targetVariable.getBranch() != null && !checkedBranches.contains(target)){

                checkedBranches.add(target);

                System.out.println(target + " has a branch: " + targetVariable.getBranch());

                if (isTrue(toHash, targetVariable.getBranch())){
                    System.out.println("Branch true");
                    String textOut = targetVariable.getConditions().get(0);
                    System.out.println(textOut);
                }
                else{
                    System.out.println("Branch false");
                    String textOut = targetVariable.getConditions().get(1);
                    System.out.println(textOut);
                }

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
            if (n.getTitle().equals(title)) {
                return n;
            }
        }
        return null;
    }
}
