package com.dkopsidas.octopus.service;

import java.util.List;
import com.dkopsidas.octopus.domain.dto.LeaderboardRow;

public interface LeaderboardService {
    List<LeaderboardRow> getLeaderboardByCourse(Long courseId);
}