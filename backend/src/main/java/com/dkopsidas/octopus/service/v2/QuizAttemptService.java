package com.dkopsidas.octopus.service.v2;

import com.dkopsidas.octopus.domain.dto.v2.AttemptResultDto;
import com.dkopsidas.octopus.domain.dto.v2.AttemptStartResponseDto;
import com.dkopsidas.octopus.domain.dto.v2.StartCustomAttemptRequestDto;
import com.dkopsidas.octopus.domain.dto.v2.SubmitAttemptRequestDto;

import java.util.UUID;

public interface QuizAttemptService {

    AttemptStartResponseDto startQuizAttempt(UUID quizId, Integer timerMinutes, UUID userId);

    AttemptStartResponseDto startCustomAttempt(Long courseId, StartCustomAttemptRequestDto dto, UUID userId);

    AttemptResultDto submit(UUID attemptId, SubmitAttemptRequestDto dto, UUID userId);
}
