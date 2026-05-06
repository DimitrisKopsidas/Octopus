package com.dkopsidas.octopus;

import lombok.extern.java.Log;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@SpringBootApplication
@Log
public class OctopusApplication {

//	private final DataSource dataSource;

//    public OctopusApplication(DataSource dataSource) {
//        this.dataSource = dataSource;
//    }

    public static void main(String[] args) {
		SpringApplication.run(OctopusApplication.class, args);
	}

	//	public void run(final String... args) {
//		log.info("Datasource: " + dataSource.toString());
//		final JdbcTemplate restTemplate = new JdbcTemplate(dataSource);
//		restTemplate.execute("select 1");
//	}

}
