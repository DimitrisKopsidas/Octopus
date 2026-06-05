package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.SettingsInfoResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface QuestionService {

    QuestionResponseDto createQuestion(CreateQuestionRequestDto dto);

    List<QuestionResponseDto> listQuestions(Long courseId);

    QuestionResponseDto updateQuestion(Long questionId, UpdateQuestionRequestDto dto);

    void deleteQuestion(Long questionId);

    SettingsInfoResponseDto listSettingsInfo(Long courseId);

    List<QuestionResponseDto> listQuestionsBySetNum(Long courseId, Integer setNum);

    List<QuestionResponseDto> listQuestionsByRandomCount(Long courseId, Integer randomCount);

    QuestionResponseDto uploadImage(Long questionId, MultipartFile file) throws IOException;

    QuestionResponseDto deleteImage(Long questionId) throws IOException;
}
