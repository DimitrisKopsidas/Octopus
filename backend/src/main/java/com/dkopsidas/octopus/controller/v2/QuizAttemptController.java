package com.dkopsidas.octopus.controller.v2;

import com.dkopsidas.octopus.domain.dto.v2.*;
import com.dkopsidas.octopus.service.v2.QuizAttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v2")
public class QuizAttemptController {

    private final QuizAttemptService attemptService;

    @PostMapping(path = "/quizzes/{quizId}/attempts")
    public ResponseEntity<AttemptStartResponseDto> startQuizAttempt(
            @PathVariable UUID quizId,
            @Valid @RequestBody(required = false) StartQuizAttemptRequestDto dto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Integer timer = dto == null ? null : dto.timerMinutes();
        return new ResponseEntity<>(attemptService.startQuizAttempt(quizId, timer, userId(jwt)), HttpStatus.CREATED);
    }

    @PostMapping(path = "/courses/{courseId}/attempts")
    public ResponseEntity<AttemptStartResponseDto> startCustomAttempt(
            @PathVariable Long courseId,
            @Valid @RequestBody StartCustomAttemptRequestDto dto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return new ResponseEntity<>(attemptService.startCustomAttempt(courseId, dto, userId(jwt)), HttpStatus.CREATED);
    }

    @PostMapping(path = "/attempts/{attemptId}/submit")
    public ResponseEntity<AttemptResultDto> submit(
            @PathVariable UUID attemptId,
            @Valid @RequestBody SubmitAttemptRequestDto dto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(attemptService.submit(attemptId, dto, userId(jwt)));
    }

    @GetMapping(path = "/attempts")
    public ResponseEntity<Page<AttemptSummaryDto>> listMyAttempts(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 20, sort = "finishedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(attemptService.listUserAttempts(userId(jwt), pageable));
    }

    @GetMapping(path = "/attempts/{attemptId}")
    public ResponseEntity<AttemptDetailDto> getMyAttempt(
            @PathVariable UUID attemptId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(attemptService.getUserAttempt(attemptId, userId(jwt)));
    }

    private static UUID userId(Jwt jwt) {
        return jwt == null ? null : UUID.fromString(jwt.getSubject());
    }
}
