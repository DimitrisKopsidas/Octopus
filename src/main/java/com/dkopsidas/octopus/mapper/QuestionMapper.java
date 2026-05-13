package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.CreateQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateQuestionRequest;
import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Question;

public interface QuestionMapper {

    CreateQuestionRequest fromDto(CreateQuestionRequestDto dto);

    UpdateQuestionRequest fromDto(UpdateQuestionRequestDto dto);

    QuestionDto toDto(Question question);
}
