package com.dkopsidas.octopus.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.dkopsidas.octopus.repository.BundleRepository;
import com.dkopsidas.octopus.domain.dto.LeaderboardRow;
import com.dkopsidas.octopus.service.LeaderboardService;
import java.util.List;

@RequiredArgsConstructor
@Service
public class LeaderboardServiceImpl implements LeaderboardService {

    private final BundleRepository bundleRepository;

    @Override
    public List<LeaderboardRow> getLeaderboardByCourse(Long courseId) {
        return bundleRepository.findLeaderboardByCourse(courseId);
    }
}