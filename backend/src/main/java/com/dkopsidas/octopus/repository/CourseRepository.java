package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CourseRepository extends JpaRepository<Course, Long> {
}
