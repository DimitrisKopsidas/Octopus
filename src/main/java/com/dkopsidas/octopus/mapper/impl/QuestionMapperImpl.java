package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.CreateQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateQuestionRequest;
import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.mapper.QuestionMapper;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapperImpl implements QuestionMapper {
    @Override
    public CreateQuestionRequest fromDto(CreateQuestionRequestDto dto) {
        return new CreateQuestionRequest(
                dto.title(),
                dto.answers(),
                dto.courseId()
        );
    }

    @Override
    public UpdateQuestionRequest fromDto(UpdateQuestionRequestDto dto) {
        return new UpdateQuestionRequest(
                dto.title()
        );
    }

    @Override
    public QuestionDto toDto(Question question) {
        return new QuestionDto(
            question.getId(),
            question.getTitle(),
            question.getAnswers(),
            question.getCourse().getId()
        );
    }
}
