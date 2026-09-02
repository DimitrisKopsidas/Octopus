package com.dkopsidas.octopus.exception;

/**
 * A question was saved without a single correct answer.
 * <p>
 * Carries the question title, not its id: the check runs before the row is
 * written on create, and on update it runs against a freshly mapped entity that
 * never had an id -- so the id was null at both call sites and the message that
 * reached the user said nothing about which question was at fault.
 * <p>
 * The message is user-facing verbatim. SimpleException is rendered by
 * GlobalExceptionHandler as a 400 with a plain-text body, and the frontend's
 * extractErrorMessage returns string bodies as-is, so whatever is written here
 * is what the helper reads on screen.
 */
public class CorrectAnswerCountException extends SimpleException {

    public CorrectAnswerCountException(String questionTitle) {
        super(questionTitle == null || questionTitle.isBlank()
                ? "Κάθε ερώτηση πρέπει να έχει τουλάχιστον μία σωστή απάντηση."
                : "Η ερώτηση «" + questionTitle + "» δεν έχει καμία σωστή απάντηση.");
    }
}
