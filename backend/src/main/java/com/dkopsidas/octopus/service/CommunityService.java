package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CommunityActivityDto;
import com.dkopsidas.octopus.domain.dto.PublicUserDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

/** Public profiles and the Community directory. Everything here is public: active users only. */
public interface CommunityService {

    Optional<PublicUserDto> getProfile(String username);

    Page<PublicUserDto> search(String role, Integer year, String query, String sort, int page, int size);

    PublicUserDto.Summary getSummary();

    List<CommunityActivityDto> getRecentActivity(int limit);
}
