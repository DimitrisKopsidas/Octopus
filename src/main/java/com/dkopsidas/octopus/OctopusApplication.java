package com.dkopsidas.octopus;

import lombok.extern.java.Log;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@SpringBootApplication
@Log
public class OctopusApplication {
    public static void main(String[] args) {
		SpringApplication.run(OctopusApplication.class, args);
	}
}
