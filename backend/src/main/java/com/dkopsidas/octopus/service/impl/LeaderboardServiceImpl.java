package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.LeaderboardRowDto;
import com.dkopsidas.octopus.domain.entity.Bundle;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.repository.BundleRepository;
import com.dkopsidas.octopus.repository.QuestionRepository;
import com.dkopsidas.octopus.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class LeaderboardServiceImpl implements LeaderboardService {

    private final BundleRepository bundleRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getMostPopularCourses() {
        List<Bundle> bundles = bundleRepository.findAll();

        return bundles.stream()
                .filter(b -> !b.getAnswers().isEmpty())
                .collect(Collectors.groupingBy(
                        b -> b.getAnswers().getFirst().getQuestion().getCourse().getName(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> new LeaderboardRowDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingDouble(LeaderboardRowDto::value).reversed())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getUsersByAverageScore() {
        List<Bundle> bundles = bundleRepository.findAll();

        return bundles.stream()
                .collect(Collectors.groupingBy(Bundle::getUser, Collectors.averagingInt(Bundle::getScore)))
                .entrySet().stream()
                .map(e -> new LeaderboardRowDto(e.getKey().publicName(), e.getValue()))
                .sorted(Comparator.comparingDouble(LeaderboardRowDto::value).reversed())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getLeaderboardByCourse(Long courseId) {
        List<Bundle> bundles = bundleRepository.findDistinctByAnswers_Question_Course_Id(courseId);

        return bundles.stream()
                .collect(Collectors.groupingBy(Bundle::getUser))
                .values().stream()
                .map(userBundles -> userBundles.stream()
                        .max(Comparator.comparingInt(Bundle::getScore))
                        .orElseThrow())
                .map(best -> new LeaderboardRowDto(
                        best.getUser().publicName(),
                        best.getScore()
                ))
                .sorted(Comparator.comparingDouble(LeaderboardRowDto::value).reversed())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getCoursesByAverageScore() {
        List<Bundle> bundles = bundleRepository.findAll();

        return bundles.stream()
                .filter(b -> !b.getAnswers().isEmpty())
                .collect(Collectors.groupingBy(
                        b -> b.getAnswers().getFirst().getQuestion().getCourse().getName(),
                        Collectors.averagingDouble(Bundle::getScore)
                ))
                .entrySet().stream()
                .map(e -> new LeaderboardRowDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingDouble(LeaderboardRowDto::value).reversed())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaderboardRowDto> getHelperByTotalQuestions(){
        List<Question> questions = questionRepository.findAll();

        return questions.stream()
                .collect(Collectors.groupingBy(
                        q -> q.getCreatedBy().getUsername(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> new LeaderboardRowDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingDouble(LeaderboardRowDto::value).reversed())
                .toList();
    }
}