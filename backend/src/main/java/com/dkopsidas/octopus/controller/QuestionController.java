package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.SettingsInfoResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.exception.IsReadOnlyException;
import com.dkopsidas.octopus.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/questions")
public class QuestionController {

    @Value("${app.readonly:false}")
    private boolean readOnly;

    private final QuestionService questionService;

    @GetMapping(path = "/{courseId}/info")//GET INFORMATION NEEDED FOR SANDBOX SETTINGS
    public ResponseEntity<SettingsInfoResponseDto> listSettingsInfo(
            @PathVariable Long courseId
    ) {
        SettingsInfoResponseDto settingsInfoResponseDto = questionService.listSettingsInfo(courseId);
        return ResponseEntity.ok(settingsInfoResponseDto);
    }

    @GetMapping(path = "/{courseId}/setNum={setNum}")
    public ResponseEntity<List<QuestionResponseDto>> listQuestionsBySetNum(
            @PathVariable Long courseId,
            @PathVariable Integer setNum
    ) {
        List<QuestionResponseDto> questionResponseDtos = questionService.listQuestionsBySetNum(courseId, setNum);
        return ResponseEntity.ok(questionResponseDtos);
    }

    @GetMapping(path = "/{courseId}/randomCount={randomCount}")
    public ResponseEntity<List<QuestionResponseDto>> listQuestionsByRandomCount(
            @PathVariable Long courseId,
            @PathVariable Integer randomCount
    ) {
        List<QuestionResponseDto> questionResponseDtos = questionService.listQuestionsByRandomCount(courseId, randomCount);
        return ResponseEntity.ok(questionResponseDtos);
    }

    //BASIC CRUD---------------------------------------------------------------------------------------
    @PostMapping //CREATE QUESTION
    public ResponseEntity<QuestionResponseDto> createQuestion(
            @Valid @RequestBody CreateQuestionRequestDto createQuestionRequestDto
    ) {
        checkIsReadOnly();
        QuestionResponseDto createdQuestion = questionService.createQuestion(createQuestionRequestDto);
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    @GetMapping(path = "/{courseId}") //GET ALL QUESTIONS OF COURSE
    public ResponseEntity<List<QuestionResponseDto>> listQuestions(
            @PathVariable Long courseId
    ) {
        List<QuestionResponseDto> questionResponseDtos = questionService.listQuestions(courseId);
        return ResponseEntity.ok(questionResponseDtos);
    }

    @PutMapping(path = "/{questionId}")
    public ResponseEntity<QuestionResponseDto> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody UpdateQuestionRequestDto updateQuestionRequestDto
    ) {
        checkIsReadOnly();
        QuestionResponseDto updatedQuestion = questionService.updateQuestion(questionId, updateQuestionRequestDto);
        return ResponseEntity.ok(updatedQuestion);
    }

    @DeleteMapping(path = "/{questionId}")
    public ResponseEntity<Void> deleteQuestion (
            @PathVariable Long questionId) {
        checkIsReadOnly();
        questionService.deleteQuestion(questionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void checkIsReadOnly(){
        if (readOnly)
            throw new IsReadOnlyException();
    }
}
