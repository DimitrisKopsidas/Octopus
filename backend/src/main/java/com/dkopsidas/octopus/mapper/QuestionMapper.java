package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;

import java.util.List;

public interface QuestionMapper {

    Question toEntity(CreateQuestionRequestDto dto, Course courseById);

    Question toEntity(UpdateQuestionRequestDto dto);

    QuestionResponseDto toDto(Question question);

    List<QuestionResponseDto> toDto(List<Question> questionList);
}
