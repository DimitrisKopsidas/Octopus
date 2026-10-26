package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.LeaderboardRowDto;
import com.dkopsidas.octopus.repository.BundleRepository;
import com.dkopsidas.octopus.repository.QuestionRepository;
import com.dkopsidas.octopus.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

    private final BundleRepository bundleRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getMostPopularCourses() {
        return bundleRepository.findMostPopularCourses();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getUsersByAverageScore() {
        return bundleRepository.findUsersByAverageScore();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getLeaderboardByCourse(Long courseId) {
        return bundleRepository.findLeaderboardByCourse(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getCoursesByAverageScore() {
        return bundleRepository.findCoursesByAverageScore();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getHelperByTotalQuestions(){
        return bundleRepository.findQuestionsCreatedByUser();
    }
}