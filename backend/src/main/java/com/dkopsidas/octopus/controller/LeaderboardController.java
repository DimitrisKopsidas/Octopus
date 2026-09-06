package com.dkopsidas.octopus.controller;
import com.dkopsidas.octopus.domain.dto.LeaderboardRowDto;
import com.dkopsidas.octopus.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/users/avg")
    public ResponseEntity<List> getAvgScore() {
        List<LeaderboardRowDto> avgLeaderboard = leaderboardService.getUsersByAverageScore();
        return ResponseEntity.ok(avgLeaderboard);
    }

    @GetMapping("/courses/{course_id}")
    public ResponseEntity<List> getByCourse(@PathVariable Long course_id) {
        List<LeaderboardRowDto> byCourse = leaderboardService.getLeaderboardByCourse(course_id);
        return ResponseEntity.ok(byCourse);
    }

    @GetMapping("/courses/popular")
    public ResponseEntity<List> getPopularCourses() {
        List<LeaderboardRowDto> allCourses = leaderboardService.getMostPopularCourses();
        return ResponseEntity.ok(allCourses);
    }

    @GetMapping("/courses/avg")
    public ResponseEntity<List> getAvgScoreByCourse() {
        List<LeaderboardRowDto> avgLeaderboard = leaderboardService.getCoursesByAverageScore();
        return ResponseEntity.ok(avgLeaderboard);
    }

    @GetMapping("/helpers/total_questions")
    public ResponseEntity<List> getHelperByTotalQuestions() {
        List<LeaderboardRowDto> helpers = leaderboardService.getHelperByTotalQuestions();
        return ResponseEntity.ok(helpers);
    }
}
