package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/questions")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponseDto> createQuestion(
            @Valid @RequestBody CreateQuestionRequestDto createQuestionRequestDto
    ) {
        QuestionResponseDto createdQuestion = questionService.createQuestion(createQuestionRequestDto);
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    @GetMapping(path = "/{courseId}")
    public ResponseEntity<List<QuestionResponseDto>> listQuestions(
            @PathVariable Long courseId
    ) {
        List<QuestionResponseDto> questionResponseDtos = questionService.listQuestions(courseId);
        return ResponseEntity.ok(questionResponseDtos);
    }

    @GetMapping(path = "/{courseId}/count")
    public ResponseEntity<Long> listQuestionsCount(
            @PathVariable Long courseId
    ) {
        Long count = questionService.countQuestions(courseId);
        return ResponseEntity.ok(count);
    }

    @PutMapping(path = "/{questionId}")
    public ResponseEntity<QuestionResponseDto> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody UpdateQuestionRequestDto updateQuestionRequestDto
    ) {
        QuestionResponseDto updatedQuestion = questionService.updateQuestion(questionId, updateQuestionRequestDto);
        return ResponseEntity.ok(updatedQuestion);
    }

    @DeleteMapping(path = "/{questionId}")
    public ResponseEntity<Void> deleteQuestion (
            @PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
