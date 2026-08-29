package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.ImportQuestionsRequestDto;
import com.dkopsidas.octopus.domain.dto.ImportQuestionsResponseDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.SettingsInfoResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/questions")
public class QuestionController {

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

    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @PostMapping(path = "/{questionId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<QuestionResponseDto> uploadImage(
            @PathVariable Long questionId,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(questionService.uploadImage(questionId, file));
    }

    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @DeleteMapping(path = "/{questionId}/image")
    public ResponseEntity<QuestionResponseDto> deleteImage(
            @PathVariable Long questionId) throws IOException {
        return ResponseEntity.ok(questionService.deleteImage(questionId));
    }

    // Writes are HELPER/ADMIN only. The GET endpoints stay open: SecurityConfig
    // permits /api/v1/questions/** for anonymous readers, and the quiz needs that.
    //BASIC CRUD---------------------------------------------------------------------------------------
    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @PostMapping(path = "/{courseId}/import")
    public ResponseEntity<ImportQuestionsResponseDto> importQuestions(
            @PathVariable Long courseId,
            @Valid @RequestBody ImportQuestionsRequestDto importRequestDto
    ) {
        ImportQuestionsResponseDto result = questionService.importQuestions(courseId, importRequestDto);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @PostMapping //CREATE QUESTION
    public ResponseEntity<QuestionResponseDto> createQuestion(
            @Valid @RequestBody CreateQuestionRequestDto createQuestionRequestDto
    ) {
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

    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @PutMapping(path = "/{questionId}")
    public ResponseEntity<QuestionResponseDto> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody UpdateQuestionRequestDto updateQuestionRequestDto
    ) {
        QuestionResponseDto updatedQuestion = questionService.updateQuestion(questionId, updateQuestionRequestDto);
        return ResponseEntity.ok(updatedQuestion);
    }

    @PreAuthorize("hasAnyRole('HELPER','ADMIN')")
    @PatchMapping(path = "/{questionId}")
    public ResponseEntity<QuestionResponseDto> deactivateQuestion (
            @PathVariable Long questionId) {
        QuestionResponseDto updatedQuestion = questionService.deactivateQuestion(questionId);
        return ResponseEntity.ok(updatedQuestion);
    }
}
