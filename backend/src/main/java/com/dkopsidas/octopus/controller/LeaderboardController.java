package com.dkopsidas.octopus.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import com.dkopsidas.octopus.domain.dto.LeaderboardRow;
import com.dkopsidas.octopus.service.LeaderboardService;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping(path = "/{courseId}")
    public ResponseEntity<List<LeaderboardRow>> getLeaderboardByCourse(
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(leaderboardService.getLeaderboardByCourse(courseId));
    }
}