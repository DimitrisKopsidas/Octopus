package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.CreateMulQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateMulQuestionRequest;
import com.dkopsidas.octopus.domain.dto.CreateMulQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.MulQuestionDto;
import com.dkopsidas.octopus.domain.dto.UpdateMulQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.MulQuestion;
import com.dkopsidas.octopus.mapper.MulQuestionMapper;
import org.springframework.stereotype.Component;

@Component
public class MulQuestionMapperImpl implements MulQuestionMapper {
    @Override
    public CreateMulQuestionRequest fromDto(CreateMulQuestionRequestDto dto) {
        return new CreateMulQuestionRequest(
                dto.title(),
                dto.mulAnswers(),
                dto.courseId()
        );
    }

    @Override
    public UpdateMulQuestionRequest fromDto(UpdateMulQuestionRequestDto dto) {
        return new UpdateMulQuestionRequest(
                dto.title()
        );
    }

    @Override
    public MulQuestionDto toDto(MulQuestion mulQuestion) {
        return new MulQuestionDto(
            mulQuestion.getId(),
            mulQuestion.getTitle(),
            mulQuestion.getMulAnswers(),
            mulQuestion.getCourse().getId()
        );
    }
}
