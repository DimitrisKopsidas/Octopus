package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CreateBundleRequestDto;
import com.dkopsidas.octopus.domain.dto.BundleResponseDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Bundle;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.mapper.BundleMapper;
import com.dkopsidas.octopus.repository.AnswerRepository;
import com.dkopsidas.octopus.repository.BundleRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.security.AuthenticatedUser;
import com.dkopsidas.octopus.service.BundleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import org.springframework.context.ApplicationEventPublisher;
import java.util.List;

@RequiredArgsConstructor
@Service
public class BundleServiceImpl implements BundleService {

    private final UserRepository userRepository;
    private final BundleRepository bundleRepository;
    private final AnswerRepository answerRepository;
    private final BundleMapper bundleMapper;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Transactional για δύο λόγους: είναι write, και το audit log θέλει να
     * διαβάσει answer -> question -> course, που είναι LAZY. Με
     * spring.jpa.open-in-view=false το persistence context κλείνει μόλις
     * γυρίσει το repository, οπότε χωρίς transaction η διαδρομή έσκαγε.
     */
    @Override
    @Transactional
    public BundleResponseDto createBundle(CreateBundleRequestDto createRequest) {
        List<Answer> answers = answerRepository.findAllById(createRequest.answerIds());

        AuthenticatedUser principal = (AuthenticatedUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User userRef = userRepository.getReferenceById(principal.getId());

        int score = (int) answers.stream()
                .filter(Answer::getIsCorrect)
                .count();

        Bundle bundle = bundleMapper.toEntity(createRequest, answers);
        bundle.setScore(score);

        Bundle saved = bundleRepository.save(bundle);

        String courseLabel = answers.stream()
                .findFirst()
                .map(a -> a.getQuestion().getCourse())
                .map(c -> "\"" + c.getName() + "\" (#" + c.getId() + ")")
                .orElse("unknown course");

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.BUNDLE_CREATED,
                "BUNDLE",
                saved.getId().toString(),
                "Completed quiz in course " + courseLabel
                        + ": score " + score + "/" + answers.size()
                        + (createRequest.setNum() != null ? ", set #" + createRequest.setNum() : ", custom test")
                        + (createRequest.timeForCompletion() != null
                                ? ", time " + createRequest.timeForCompletion() + "s" : "")
        ));

        bundle.setCreatedBy(userRef);

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

