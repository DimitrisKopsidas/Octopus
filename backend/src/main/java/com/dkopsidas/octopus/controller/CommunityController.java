package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.PublicUserDto;
import com.dkopsidas.octopus.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Public (permitAll) profiles and member directory. */
@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/community")
public class CommunityController {

    private final CommunityService communityService;

    /** @param sort newest (default) | oldest | name | quizzes | questions; size is capped at 50 */
    @GetMapping
    public ResponseEntity<Page<PublicUserDto>> search(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size
    ) {
        return ResponseEntity.ok(communityService.search(role, year, q, sort, page, size));
    }

    @GetMapping("/summary")
    public ResponseEntity<PublicUserDto.Summary> getSummary() {
        return ResponseEntity.ok(communityService.getSummary());
    }

    /** 404 when there is no active user with this username. */
    @GetMapping("/users/{username}")
    public ResponseEntity<PublicUserDto> getProfile(@PathVariable String username) {
        return ResponseEntity.of(communityService.getProfile(username));
    }
}
