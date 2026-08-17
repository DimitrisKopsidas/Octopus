package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CreateBundleRequestDto;
import com.dkopsidas.octopus.domain.dto.BundleResponseDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Bundle;
import com.dkopsidas.octopus.mapper.BundleMapper;
import com.dkopsidas.octopus.repository.AnswerRepository;
import com.dkopsidas.octopus.repository.BundleRepository;
import com.dkopsidas.octopus.service.BundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import org.springframework.context.ApplicationEventPublisher;
import java.util.List;

@RequiredArgsConstructor
@Service
public class BundleServiceImpl implements BundleService {

    private final BundleRepository bundleRepository;
    private final AnswerRepository answerRepository;
    private final BundleMapper bundleMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public BundleResponseDto createBundle(CreateBundleRequestDto createRequest) {
        List<Answer> answers = answerRepository.findAllById(createRequest.answerIds());

        int score = (int) answers.stream()
                .filter(Answer::getIsCorrect)
                .count();

        Bundle bundle = bundleMapper.toEntity(createRequest, answers);
        bundle.setScore(score);

        Bundle saved = bundleRepository.save(bundle);

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.BUNDLE_CREATED,
                "BUNDLE",
                saved.getId().toString(),
                "Created bundle score=" + score + "/" + answers.size()
        ));

        return bundleMapper.toDto(saved);
    }

    @Override
    public Long countBundle() {
        return bundleRepository.count();
    }

    @Override
    public Long countByCourse(Long courseId) {
        return bundleRepository.countByCourseId(courseId);
    }
}

