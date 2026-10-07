package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.LeaderboardRowDto;

import java.util.List;

public interface LeaderboardService {
    List<LeaderboardRowDto> getMostPopularCourses();
    List<LeaderboardRowDto> getUsersByAverageScore();
    List<LeaderboardRowDto> getLeaderboardByCourse(Long courseId);
    List<LeaderboardRowDto> getCoursesByAverageScore();
    List<LeaderboardRowDto> getHelperByTotalQuestions();
}