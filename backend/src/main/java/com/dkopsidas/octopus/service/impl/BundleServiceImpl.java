package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CreateBundleRequestDto;
import com.dkopsidas.octopus.domain.dto.BundleResponseDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Bundle;
import com.dkopsidas.octopus.mapper.BundleMapper;
import com.dkopsidas.octopus.repository.AnswerRepository;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.BundleRepository;
import com.dkopsidas.octopus.service.BundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.List;

@RequiredArgsConstructor
@Service
public class BundleServiceImpl implements BundleService {

    private final BundleRepository bundleRepository;
    private final AnswerRepository answerRepository;
    private final BundleMapper bundleMapper;

    @Override
    public BundleResponseDto createBundle(CreateBundleRequestDto createRequest) {
        List<Answer> answers = answerRepository.findAllById(createRequest.answerIds());

        int score = (int) answers.stream()
                .filter(Answer::getIsCorrect)
                .count();

        Bundle bundle = bundleMapper.toEntity(createRequest, answers);
        bundle.setScore(score);

        return bundleMapper.toDto(bundleRepository.save(bundle));
    }

    @Override
    public Long countBundle() {
        return bundleRepository.count();
    }
}

