package com.dkopsidas.octopus.service.v2;

import com.dkopsidas.octopus.domain.dto.v2.QuizDetailDto;
import com.dkopsidas.octopus.domain.dto.v2.QuizRequestDto;
import com.dkopsidas.octopus.domain.dto.v2.QuizResponseDto;

import java.util.List;
import java.util.UUID;

public interface QuizService {

    QuizResponseDto createQuiz(QuizRequestDto dto);

    List<QuizResponseDto> listQuizzes(Long courseId);

    QuizDetailDto getQuiz(UUID quizId);

    /** Deletes the quiz and creates a new one from dto. The returned quiz has a new id. */
    QuizResponseDto replaceQuiz(UUID quizId, QuizRequestDto dto);
}
