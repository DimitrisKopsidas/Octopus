package com.dkopsidas.octopus.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ReadinessController {

    private final JdbcTemplate jdbcTemplate;

    public ReadinessController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/readyz")
    public ResponseEntity<Void> readyZ(){
        try {
            jdbcTemplate.execute("SELECT 1");
            return ResponseEntity.ok().build(); //200 ok
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build(); //503
        }

    }
}
