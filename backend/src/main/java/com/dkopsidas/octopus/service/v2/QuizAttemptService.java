package com.dkopsidas.octopus.service.v2;

import com.dkopsidas.octopus.domain.dto.v2.AttemptResultDto;
import com.dkopsidas.octopus.domain.dto.v2.AttemptStartResponseDto;
import com.dkopsidas.octopus.domain.dto.v2.StartCustomAttemptRequestDto;
import com.dkopsidas.octopus.domain.dto.v2.SubmitAttemptRequestDto;

import com.dkopsidas.octopus.domain.dto.v2.AttemptDetailDto;
import com.dkopsidas.octopus.domain.dto.v2.AttemptSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface QuizAttemptService {

    AttemptStartResponseDto startQuizAttempt(UUID quizId, Integer timerMinutes, UUID userId);

    AttemptStartResponseDto startCustomAttempt(Long courseId, StartCustomAttemptRequestDto dto, UUID userId);

    AttemptResultDto submit(UUID attemptId, SubmitAttemptRequestDto dto, UUID userId);

    Page<AttemptSummaryDto> listUserAttempts(UUID userId, Pageable pageable);

    AttemptDetailDto getUserAttempt(UUID attemptId, UUID userId);
}
