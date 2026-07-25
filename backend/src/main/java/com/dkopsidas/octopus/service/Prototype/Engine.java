package com.dkopsidas.octopus.service.Prototype;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Engine {

    public static void main(String[] args){

        Map<String, Double> variables = new HashMap<>();
        variables.put("VBE", 0.7);
        variables.put("VE", 0.0);
        variables.put("VBB", 4.0);
        variables.put("RB",91000.0);

        List<String> goals = List.of("VB", "IB");

        List<String> steps = List.of("VB = VBE + VE", "IB = (VBB - VB)/ RB");

        Exercise test = new Exercise(
                "Askisi test",
                "Vreite to VB gia VBE = 0.7 kai VE = 5",
                "imageUrl",
                variables,
                goals,
                steps
        );

        for (int i = 0; i < steps.size(); i++){
            String step = test.getSteps().get(i);

            String target = step.split("=")[0].trim(); //Kovw to komati kai pernw to zitoumeno apo to step

            double answer = solveStep(variables, step);
            variables.put(target, answer); //apothikeuoume sto variables to step

            System.out.println("Step "+ i + ": " + answer);
        }

    }

    private static double solveStep(Map<String, Double> variables, String step){
        String[] parts = step.split("="); //Kovw to step sto '='
        String equation = parts[1].trim(); // pernw mono to komati pou exei tin praji

        ExpressionBuilder builder = new ExpressionBuilder(equation);

        for (String key : variables.keySet()) { //Apo to Map pernoume ta keys
            builder.variable(key); //kai ta vazoume ws variables
        }

        Expression expression = builder.build();
        for (String key : variables.keySet()){ //pernoume ta keys
            expression.setVariable(key, variables.get(key)); //kai vazoume se kathe varible tin timi tou
        }

        return expression.evaluate();

    }
}
