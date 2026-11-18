package com.dkopsidas.octopus.controller.v2;

import com.dkopsidas.octopus.domain.dto.v2.QuizDetailDto;
import com.dkopsidas.octopus.domain.dto.v2.QuizRequestDto;
import com.dkopsidas.octopus.domain.dto.v2.QuizResponseDto;
import com.dkopsidas.octopus.service.v2.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v2")
public class QuizController {

    private final QuizService quizService;

    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @PostMapping(path = "/quizzes")
    public ResponseEntity<QuizResponseDto> createQuiz(@Valid @RequestBody QuizRequestDto dto) {
        return new ResponseEntity<>(quizService.createQuiz(dto), HttpStatus.CREATED);
    }

    @GetMapping(path = "/courses/{courseId}/quizzes")
    public ResponseEntity<List<QuizResponseDto>> listQuizzes(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.listQuizzes(courseId));
    }

    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @GetMapping(path = "/quizzes/{quizId}")
    public ResponseEntity<QuizDetailDto> getQuiz(@PathVariable UUID quizId) {
        return ResponseEntity.ok(quizService.getQuiz(quizId));
    }

    // Editing a set = delete + create, so the response carries a new id.
    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @PutMapping(path = "/quizzes/{quizId}")
    public ResponseEntity<QuizResponseDto> replaceQuiz(
            @PathVariable UUID quizId,
            @Valid @RequestBody QuizRequestDto dto
    ) {
        return ResponseEntity.ok(quizService.replaceQuiz(quizId, dto));
    }
}
