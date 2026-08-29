package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.AccessDemoResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AccessDemoController {

    @GetMapping("/healthz")
    public ResponseEntity<AccessDemoResponseDto> healthz() {
        return ResponseEntity.ok(
                new AccessDemoResponseDto(
                        "healthz",
                        "PUBLIC",
                        null,
                        List.of()
                )
        );
    }

}
