package com.dkopsidas.octopus.service;

import java.util.UUID;

public interface BadgeEvaluationService {

    void evaluateQuestionMilestones(UUID userId);

    void evaluateQuizMilestones(UUID userId);

    void recordNewMember(UUID userId);
}
