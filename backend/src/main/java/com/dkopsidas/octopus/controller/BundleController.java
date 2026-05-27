package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CreateBundleRequestDto;
import com.dkopsidas.octopus.domain.dto.BundleResponseDto;
import com.dkopsidas.octopus.service.BundleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/bundles")
public class BundleController {

    private final BundleService bundleService;

    //BASIC CRUD---------------------------------------------------------------------------------------
    @PostMapping //CREATE QUESTION
    public ResponseEntity<BundleResponseDto> createBundle(
            @Valid @RequestBody CreateBundleRequestDto createBundleRequestDto
    ) {
        BundleResponseDto createdBundle = bundleService.createBundle(createBundleRequestDto);
        return new ResponseEntity<>(createdBundle, HttpStatus.CREATED);
    }
}
