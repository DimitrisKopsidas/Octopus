package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.AnswerResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateBundleRequestDto;
import com.dkopsidas.octopus.domain.dto.BundleResponseDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Bundle;
import com.dkopsidas.octopus.mapper.BundleMapper;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class BundleMapperImpl implements BundleMapper {

    @Override
    public Bundle toEntity(CreateBundleRequestDto dto, List<Answer> answers) {
        Bundle bundle = new Bundle();
        bundle.setSetNum(dto.setNum());
        bundle.setScore(0);
        bundle.setCreated(Instant.now());

        answers.forEach(bundle::addAnswer);

        return bundle;
    }

    @Override
    public BundleResponseDto toDto(Bundle bundle) {
        List<AnswerResponseDto> answers = bundle.getAnswers().stream()
                .map(answer -> new AnswerResponseDto(
                        answer.getId(),
                        answer.getTitle(),
                        answer.getIsCorrect()))
                .toList();

        return new BundleResponseDto(
                bundle.getId(),
                bundle.getSetNum(),
                bundle.getScore(),
                answers,
                bundle.getCreated()
        );
    }

    @Override
    public List<BundleResponseDto> toDto(List<Bundle> bundleList) {
        return bundleList.stream()
                .map(this::toDto)
                .toList();
    }
}

