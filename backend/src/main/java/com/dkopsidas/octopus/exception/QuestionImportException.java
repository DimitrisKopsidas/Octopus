package com.dkopsidas.octopus.exception;

import java.util.List;

/**
 * One or more entries in an import file are unusable. Carries every problem at
 * once so the author fixes the whole file in one pass instead of one line per
 * upload. Nothing is written when this is thrown -- the import is all or nothing.
 */
public class QuestionImportException extends RuntimeException {

    private final List<String> problems;

    public QuestionImportException(List<String> problems) {
        super("The import file has " + problems.size() + " problem(s)");
        this.problems = List.copyOf(problems);
    }

    public List<String> getProblems() {
        return problems;
    }
}
