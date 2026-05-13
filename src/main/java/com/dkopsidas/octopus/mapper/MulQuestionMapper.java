package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.CreateMulQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateMulQuestionRequest;
import com.dkopsidas.octopus.domain.dto.CreateMulQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.MulQuestionDto;
import com.dkopsidas.octopus.domain.dto.UpdateMulQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.MulQuestion;

public interface MulQuestionMapper {

    CreateMulQuestionRequest fromDto(CreateMulQuestionRequestDto dto);

    UpdateMulQuestionRequest fromDto(UpdateMulQuestionRequestDto dto);

    MulQuestionDto toDto(MulQuestion mulQuestion);
}
