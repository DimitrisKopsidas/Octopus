package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.CreateMulQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateMulQuestionRequest;
import com.dkopsidas.octopus.domain.dto.CreateMulQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.MulQuestionDto;
import com.dkopsidas.octopus.domain.dto.UpdateMulQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.MulQuestion;
import com.dkopsidas.octopus.mapper.MulQuestionMapper;
import com.dkopsidas.octopus.service.MulQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/mulQuestions")
public class MulQuestionController {

    private final MulQuestionService mulQuestionService;
    private final MulQuestionMapper mulQuestionMapper;

    @PostMapping
    public ResponseEntity<MulQuestionDto> createMulQuestion(
            @Valid @RequestBody CreateMulQuestionRequestDto createMulQuestionRequestDto
    ) {
        CreateMulQuestionRequest createMulQuestionRequest = mulQuestionMapper.fromDto(createMulQuestionRequestDto);
        MulQuestion mulQuestion = mulQuestionService.createMulQuestion(createMulQuestionRequest);//to service layer
        MulQuestionDto createdMulQuestionDto = mulQuestionMapper.toDto(mulQuestion);//back to dto to return as response
        return new ResponseEntity<>(createdMulQuestionDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MulQuestionDto>> listMulQuestions(
            @PathVariable Course course
    ) {
        List<MulQuestion> mulQuestions = mulQuestionService.listMulQuestions(course);
        List<MulQuestionDto> mulQuestionDtos = mulQuestions.stream().map(mulQuestionMapper::toDto).toList();
        return ResponseEntity.ok(mulQuestionDtos);
    }

    @PutMapping(path = "/{mulQuestionId}")
    public ResponseEntity<MulQuestionDto> updateMulQuestion(
            @PathVariable Long mulQuestionId,
            @Valid @RequestBody UpdateMulQuestionRequestDto updateMulQuestionRequestDto
    ) {
        UpdateMulQuestionRequest updateMulQuestionRequest = mulQuestionMapper.fromDto(updateMulQuestionRequestDto);
        MulQuestion mulQuestion = mulQuestionService.updateMulQuestion(mulQuestionId, updateMulQuestionRequest);
        MulQuestionDto mulQuestionDto = mulQuestionMapper.toDto(mulQuestion);
        return ResponseEntity.ok(mulQuestionDto);
    }

    public ResponseEntity<Void> deleteMulQuestion (@PathVariable Long mulQuestionId) {
        mulQuestionService.deleteMulQuestion(mulQuestionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
